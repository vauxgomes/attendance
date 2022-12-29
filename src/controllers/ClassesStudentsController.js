const knex = require('../database')

// Controller
module.exports = {
  // Index/Get
  async index(req, res) {
    const { class_id } = req.params

    const classStudents = await knex
      .select(
        'classes.id as class_id',
        'classes.name as class_name',
        'classes.status as class_status',
        'classes.user_id as class_user_id',
        'students.id as student_id',
        'students.code as student_code',
        'students.name as student_name',
        'users.id as user_id',
        //'users.code as user_code',
        'users.name as user_name'
      )
      .from('class_students')
      .innerJoin('classes', 'classes.id', 'class_students.class_id')
      .innerJoin('students', 'students.id', 'class_students.student_id')
      .innerJoin('users', 'users.id', 'classes.user_id')
      .where({ 'classes.id': class_id })
      .orderBy(['students.name'])

    return res.send(classStudents)
  },

  // Create
  async create(req, res) {
    const { class_id } = req.params
    const { student_id } = req.body

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
      //console.log(err)
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
      const out = await knex('class_students')
        .where({ class_id, student_id })
        .del()

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
