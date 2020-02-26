const app = require('../app')
const port = process.env.PORT || 3000

app.listen(port, function() {
  console.log('Run on port =====>', port)
})
