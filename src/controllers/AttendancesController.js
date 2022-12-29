const knex = require('../database')
const { statuses } = require('../middleware/statuses')

// Controller
module.exports = {
  // Index/Get
  async index(req, res) {
    const { class_id, date } = req.params

    // Safety
    const class_ = await knex
      .select()
      .from('classes')
      .where({ id: class_id, user_id: req.user.id, status: statuses.ACTIVE })
      .first()

    if (!class_) {
      return res.status(400).json({
        success: false,
        message: 'attendances.err.invalid_class'
      })
    }

    const attendances = await knex
      .select(
        'attendances.id',
        'attendances.date',
        'attendances.class_id',
        'attendances.attended',
        // 'classes.id as class_id',
        // 'classes.name as class_name',
        'classes.status as class_status',
        // 'classes.user_id as class_user_id',
        'students.id as student_id',
        'students.code as student_code',
        'students.name as student_name',
        'students.status as student_status'
      )
      .from('students')
      .leftJoin('attendances', function () {
        this.on('attendances.student_id', 'students.id')
          .andOnVal('attendances.date', '=', date)
          .andOnVal('attendances.class_id', '=', class_id)
      })
      .leftJoin('classes', 'classes.id', 'attendances.class_id')
      .where({ 'students.status': statuses.ACTIVE })
      .orderBy(['students.name'])

    return res.send(attendances)
  },

  // Create
  async create(req, res) {
    const { class_id } = req.params
    const { student_id, date, attended } = req.body

    try {
      const [attendance] = await knex('attendances')
        .insert({
          class_id,
          student_id,
          date,
          attended
        })
        .onConflict(['class_id', 'student_id', 'date'])
        .merge()
        .returning('*')

      return res.json(attendance)
    } catch (err) {
      console.log(err)
      return res.status(400).json({
        success: false,
        message: 'attendances.create.nok'
      })
    }
  }
}
