// Imports
const express = require('express')
const routes = express.Router()

// Middlewares
const auth = require('./middlewares/auth')
const { roles, permissions } = require('./middlewares/roles')
// const delay = require('./middlewares/delay')

// Controllers
const AccountController = require('./controllers/AccountController')
const UsersController = require('./controllers/UsersController')
const CoursesController = require('./controllers/CoursesController')
const SubjectsController = require('./controllers/SubjectsController')
const ClassesController = require('./controllers/ClassesController')
const StudentsController = require('./controllers/StudentsController')
const ClassesStudentsController = require('./controllers/ClassesStudentsController')
const AttendancesController = require('./controllers/AttendancesController')

// System
routes.get('/', (req, res) => {
  res.send({ name: 'Attendance Maker', version: 'v1.0.0' })
})

// Account
routes.post('/login', AccountController.register)

// Users
routes.get('/users', auth, permissions([roles.ROOT]), UsersController.index)
routes.get('/users/detail', auth, UsersController.show)
routes.get(
  '/users/:id/detail',
  auth,
  permissions([roles.ROOT]),
  UsersController.show
)
routes.post(
  '/users/create',
  auth,
  permissions([roles.ROOT]),
  UsersController.create,
  UsersController.show
)
routes.put(
  '/users/:id/update/',
  auth,
  permissions([roles.ROOT]),
  UsersController.update
)
routes.delete(
  '/users/:id/delete/',
  auth,
  permissions([roles.ROOT]),
  UsersController.delete
)

// Courses
routes.get('/courses', auth, CoursesController.index)
routes.post(
  '/courses/create',
  auth,
  permissions([roles.ROOT]),
  CoursesController.create
)
routes.put(
  '/courses/:id/update/',
  auth,
  permissions([roles.ROOT]),
  CoursesController.update
)
routes.delete(
  '/courses/:id/delete',
  auth,
  permissions([roles.ROOT]),
  CoursesController.delete
)

// Subjects
routes.get('/courses/:course_id/subjects', auth, SubjectsController.index)
routes.post(
  '/courses/:course_id/subjects/create',
  auth,
  permissions([roles.ROOT]),
  SubjectsController.create
)
routes.put(
  '/courses/:course_id/subjects/:id/update',
  auth,
  permissions([roles.ROOT]),
  SubjectsController.update
)
routes.delete(
  '/courses/:course_id/subjects/:id/delete',
  auth,
  permissions([roles.ROOT]),
  SubjectsController.delete
)

// Classes
routes.get('/subjects/:subject_id/classes', auth, ClassesController.index)
routes.post(
  '/subjects/:subject_id/classes/create',
  auth,
  permissions([roles.ROOT]),
  ClassesController.create
)
routes.put(
  '/subjects/:subject_id/classes/:id/update',
  auth,
  permissions([roles.ROOT]),
  ClassesController.update
)
routes.delete(
  '/subjects/:subject_id/classes/:id/delete',
  auth,
  permissions([roles.ROOT]),
  ClassesController.delete
)

// Students
routes.get('/students', auth, StudentsController.index)
routes.post(
  '/students/create',
  auth,
  permissions([roles.ROOT]),
  StudentsController.create
)
routes.put(
  '/students/:id/update',
  auth,
  permissions([roles.ROOT]),
  StudentsController.update
)
routes.delete(
  '/students/:id/delete',
  auth,
  permissions([roles.ROOT]),
  StudentsController.delete
)

// Class Students
routes.get('/classes/:class_id/students', auth, ClassesStudentsController.index)
routes.post(
  '/classes/:class_id/students/:student_id/create',
  auth,
  permissions([roles.ROOT]),
  ClassesStudentsController.create
)
routes.delete(
  '/classes/:class_id/students/:student_id/delete',
  auth,
  permissions([roles.ROOT]),
  ClassesStudentsController.delete
)

// Attendances
routes.get('/classes/:class_id/attendances', auth, AttendancesController.index)
routes.get(
  '/classes/:class_id/:class_date/attendances/detail',
  auth,
  AttendancesController.show
)
routes.post(
  '/classes/:class_id/attendances/create',
  auth,
  AttendancesController.create
)
routes.put(
  '/classes/:class_id/attendances/:id/update',
  auth,
  AttendancesController.update
)
routes.delete(
  '/classes/:class_id/:class_date/attendances/delete',
  auth,
  AttendancesController.delete
)

// Export
module.exports = routes
