const knex = require('../database')

// Controller
module.exports = {
  // Index/Get
  async index(req, res) {
    const { class_id } = req.params
    const { page } = req.query

    const query = knex
      .select(
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.visible as class_visible',
        'attendances.class_date'
      )
      .from('attendances')
      .innerJoin('classes', 'classes.id', 'attendances.class_id')
      .where({ 'attendances.class_id': class_id })
      .groupBy('attendances.class_id', 'attendances.class_date')

    if (!!page) {
      query
        .limit(Number(process.env.PAGE_SIZE))
        .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
    }

    query.orderBy(['attendances.class_date']).then((attendances) => {
      res.send(attendances)
    })
  },

  // Show
  async show(req, res) {
    const { class_id, class_date } = req.params

    const query = knex
      .select(
        'attendances.id',
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.visible as class_visible',
        'attendances.class_date',
        'attendances.attended',
        'students.id as student_id',
        'students.code as student_code',
        'students.name as student_name'
      )
      .from('attendances')
      .innerJoin('classes', 'classes.id', 'attendances.class_id')
      .innerJoin('students', 'students.id', 'attendances.student_id')
      .where({
        'attendances.class_id': class_id,
        'attendances.class_date': class_date
      })

    query
      .orderBy(['attendances.class_date', 'students.name'])
      .then((attendances) => {
        res.send(attendances)
      })
  },

  // Create
  async create(req, res) {
    const { class_id } = req.params
    const { class_date } = req.body

    try {
      const classStudent = await knex
        .select('class_id', 'student_id')
        .from('class_students')
        .where({ class_id })

      if (classStudent.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'attedances.class.empty'
        })
      }

      await knex.transaction((trx) => {
        const queries = []

        classStudent.forEach((c) => {
          queries.push(
            knex('attendances')
              .insert({
                class_id: c.class_id,
                student_id: c.student_id,
                class_date,
                attended: false
              })
              .transacting(trx)
          )
        })

        Promise.all(queries)
          .then(trx.commit)
          .then(() => {
            res.status(200).json({
              success: true,
              message: 'attendances.create.ok'
            })
          })
          .catch((err) => {
            trx.rollback()

            res.status(400).json({
              success: false,
              message: 'attendances.create.err'
            })
          })
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: 'attendances.create.nok'
      })
    }
  },

  // Update
  async update(req, res) {
    const { class_id, id } = req.params
    const { attended } = req.body

    try {
      await knex('attendances').update({ attended }).where({ class_id, id })

      return res.status(200).send({
        success: true,
        message: 'attendances.update.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'attendances.update.nok'
      })
    }
  },

  // DELETE
  async delete(req, res) {
    const { class_id, class_date } = req.params

    try {
      await knex('attendances').where({ class_id, class_date }).del()

      return res.status(200).send({
        success: true,
        message: 'attendances.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'attendances.delete.nok'
      })
    }
  }
}
