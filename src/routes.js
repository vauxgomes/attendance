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
const StudentsController = require('./controllers/StudentsController')
const CoursesController = require('./controllers/CoursesController')
const SubjectsController = require('./controllers/SubjectsController')
const ClassesController = require('./controllers/ClassesController')
const ClassesStudentsController = require('./controllers/ClassesStudentsController')
const AttendancesController = require('./controllers/AttendancesController')
const FavoriteClassesController = require('./controllers/FavoriteClassesController')

// System
routes.get('/', (req, res) => {
  res.send({ name: 'Attendance Maker', version: 'v1.0.0' })
})

// Account
routes.post('/login', AccountController.register)

// Users
routes.get(
  '/users',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  UsersController.index
)
routes.post(
  '/users/create',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  UsersController.create
)
routes.put(
  '/users/:id/update/',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  UsersController.update
)
routes.delete(
  '/users/:id/delete/',
  auth,
  permissions([roles.ROOT]),
  UsersController.delete
)

// Students
routes.get(
  '/students',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  StudentsController.index
)
routes.post(
  '/students/create',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  StudentsController.create
)
routes.put(
  '/students/:id/update',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  StudentsController.update
)
routes.delete(
  '/students/:id/delete',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  StudentsController.delete
)

// Courses
routes.get(
  '/courses',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  CoursesController.index
)
routes.post(
  '/courses/create',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  CoursesController.create
)
routes.put(
  '/courses/:id/update/',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  CoursesController.update
)
routes.delete(
  '/courses/:id/delete',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  CoursesController.delete
)

// Subjects
routes.get(
  '/courses/:course_id/subjects',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  SubjectsController.index
)
routes.post(
  '/courses/:course_id/subjects/create',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  SubjectsController.create
)
routes.put(
  '/courses/:course_id/subjects/:id/update',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  SubjectsController.update
)
routes.delete(
  '/courses/:course_id/subjects/:id/delete',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  SubjectsController.delete
)

// Classes
routes.get(
  '/subjects/:subject_id/classes',
  auth,
  permissions([roles.ROOT, roles.SUPER, roles.ADMIN]),
  ClassesController.index
)
routes.post(
  '/subjects/:subject_id/classes/create',
  auth,
  permissions([roles.ROOT, roles.SUPER, roles.ADMIN]),
  ClassesController.create
)
routes.put(
  '/subjects/:subject_id/classes/:id/update',
  auth,
  permissions([roles.ROOT, roles.SUPER, roles.ADMIN]),
  ClassesController.update
)
routes.delete(
  '/subjects/:subject_id/classes/:id/delete',
  auth,
  permissions([roles.ROOT, roles.SUPER]),
  ClassesController.delete
)

// Class Students
routes.get(
  '/classes/:class_id/students',
  auth,
  permissions([roles.ROOT, roles.SUPER, roles.ADMIN]),
  ClassesStudentsController.index
)
routes.post(
  '/classes/:class_id/students/:student_id/create',
  auth,
  permissions([roles.ROOT, roles.SUPER, roles.ADMIN]),
  ClassesStudentsController.create
)
routes.delete(
  '/classes/:class_id/students/:student_id/delete',
  auth,
  permissions([roles.ROOT, roles.SUPER, roles.ADMIN]),
  ClassesStudentsController.delete
)

// Attendances
routes.get(
  '/classes/:class_id/attendances',
  auth,
  permissions([roles.ADMIN, roles.USER]),
  AttendancesController.index
)
routes.get(
  '/classes/:class_id/:date/attendances',
  auth,
  permissions([roles.ADMIN, roles.USER]),
  AttendancesController.show
)
routes.post(
  '/classes/:class_id/attendances/create',
  auth,
  permissions([roles.ADMIN, roles.USER]),
  AttendancesController.create
)

// Favorite Classes
routes.get(
  '/classes/favorite',
  auth,
  permissions([roles.ADMIN, roles.USER]),
  FavoriteClassesController.index
)
routes.post(
  '/classes/favorites/create',
  auth,
  permissions([roles.ADMIN, roles.USER]),
  FavoriteClassesController.create
)
routes.delete(
  '/classes/:class_id/favorites/delete',
  auth,
  permissions([roles.ADMIN, roles.USER]),
  FavoriteClassesController.delete
)

// Export
module.exports = routes
