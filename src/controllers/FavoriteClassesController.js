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
        'students.id as student_id',
        'students.code as student_code',
        'students.name as student_name'
      )
      .from('classes')
      .innerJoin('class_students', 'class_students.class_id', 'classes.id')
      .innerJoin('students', 'students.id', 'class_students.student_id')
      .where({ 'classes.id': class_id })

    if (!!page) {
      query
        .limit(Number(process.env.PAGE_SIZE))
        .offset((Math.max(1, Number(page)) - 1) * Number(process.env.PAGE_SIZE))
    }

    query.orderBy(['classes.name']).then((subjects) => {
      res.send(subjects)
    })
  },

  // Create
  async create(req, res) {
    const { class_id, student_id } = req.params

    try {
      await knex('class_students').insert({
        class_id,
        student_id
      })

      return res.status(200).json({
        success: true,
        message: 'class_students.create.ok'
      })
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: 'class_students.create.nok'
      })
    }
  },

  // DELETE
  async delete(req, res) {
    const { class_id, student_id } = req.params

    try {
      await knex('class_students').where({ class_id, student_id }).del()

      return res.status(200).send({
        success: true,
        message: 'class_students.delete.ok'
      })
    } catch (err) {
      return res.status(400).send({
        success: false,
        message: 'class_students.delete.nok'
      })
    }
  }
}
