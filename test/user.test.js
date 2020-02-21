const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

// const app = require('../app')
// const User = require('../models/user')

chai.use(chaiHttp)

describe('TESTING USER', function() {
  describe('1. User Register', function() {
    after(async function() {
      await User.deleteMany({})
    })

    describe('Create new', function() {
      it('Should return token with status code 201', async function() {
        const data = {
          email: 'testing@email.com',
          name: 'testing',
          password: 'testing',
          location: 'Indonesia',
        }

        const response = chai
          .request(app)
          .post('/register')
          .send(data)

        expect(response).to.have.status(201)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('token')
      })

      it('Should return error - (Empty body, code: 400)', async function() {
        const data = {}

        const response = chai
          .request(app)
          .post('/register')
          .send(data)

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(resposne.body.errors).to.include('Email is required')
        expect(resposne.body.errors).to.include('Name is required')
        expect(resposne.body.errors).to.include('Password is required')
        expect(resposne.body.errors).to.include('Location is required')
      })

      it('Should return error - (Duplicate email, code: 400)', async function() {
        const data = {
          email: 'testing@email.com',
          name: 'testing',
          password: 'testing',
          location: 'Indonesia',
        }

        const response = chai
          .request(app)
          .post('/register')
          .send(data)

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Email already registered')
      })
    })
  })
  // it will be for testing user login
})
