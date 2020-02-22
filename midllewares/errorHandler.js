module.exports = (err, req, res, next) => {
if(err.status && err.message){
    res.status(err.status).json({errors: [err.message]})
}
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

    case 'JsonWebTokenError' : 
      res.status(400).send({
              errors : ["invalid token"]
          })
      break

    case 'CastError' : 
      res.status(404).send({
            errors : "not found"
        })
      break      

    case 'NotAuthorze':
      res.status(401).json({ errors: err.messages })
      break
    
    case 'ItemAuthorize':
      res.status(401).json({ errors: err.messages })
      break

    case 'NotFound':
      res.status(404).json({ errors: err.messages })
      break

    default:
      res.status(500).json(err)
  }
}
