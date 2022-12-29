const roles = {
  ROOT: 'ROOT',
  SUPER: 'SUPER',
  ADMIN: 'ADMIN',
  USER: 'USER'
}

const permissions = (permissions) => {
  return (req, res, next) => {
    if (!permissions.includes(req.user.role)) {
      return res.status(401).json({
        success: false,
        message: 'user.permission.denied'
      })
    }

    next()
  }
}

module.exports = { roles, permissions }
