module.exports = (err, req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      const errors = []
      Object.keys(err.errors).forEach(key => {
        errors.push(err.errors[key].message)
      })
      res.status(400).json({ errors })
      break

    case 'BadRequest':
      res.status(400).json({ errors: err.messages })
      break

    default:
      res.status(500).json(err)
  }
}
