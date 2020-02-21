const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

// const app = require('../app')

chai.use(chaiHttp)

describe('/testing user', function() {
  describe('Testing dummy dulu', function() {
    expect(1).to.equal(1)
  })
})
