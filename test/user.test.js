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

    describe('Start create new user', function() {
      it('Should return token with status code 201', async function() {
        const data = {
          email: 'testing@email.com',
          name: 'testing',
          password: 'testing',
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
      })

      it('Should return error - (Duplicate email, code: 400)', async function() {
        const data = {
          email: 'testing@email.com',
          name: 'testing',
          password: 'testing',
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

  describe('2. User Login', function() {
    before(async function() {
      const newUser = await User.create({
        email: 'testing@email.com',
        name: 'testing',
        password: 'testing',
      })
    })

    after(async function() {
      User.deleteMany({})
    })

    describe('Start login user', function() {
      it('Should return token with status code 200', async function() {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'testing@email.com', password: 'testing' })

        expect(response).to.have.status(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('token')
        expect(response.body.token).to.be.a('string')
      })

      it('Should return error - (missing body, code: 400)', async function() {
        const response = await chai
          .request(app)
          .post('/login')
          .send({})

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Missing email')
        expect(response.body.errors).to.include('Missing password')
      })

      it('Should return error - (incorrect email and or passsword, code: 400)', async function() {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'wrong@email.com', password: 'wrong password' })

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Email or password is wrong')
      })
    })
  })
})
