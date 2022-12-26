const status = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
}

const statuses = (status) => {
  return (req, res, next) => {
    if (status === req.user.status) {
      return res.status(401).json({
        success: false,
        message: 'user.status.denied'
      })
    }

    next()
  }
}

module.exports = { statuses, status }
