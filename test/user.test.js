const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const app = require('../app')
const User = require('../models/user')

chai.use(chaiHttp)

let user

describe('TESTING USER', function() {
  after(async function() {
    await User.deleteMany({})
  })

  describe('1. User Register', function() {
    describe('Start create new user', function() {
      it('Should return token with status code 201', async function() {
        const data = {
          email: 'testing@email.com',
          name: 'testing',
          password: 'testing',
        }

        const response = await chai
          .request(app)
          .post('/register')
          .send(data)

        expect(response).to.have.status(201)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('token')
        expect(response.body).to.have.property('email')
        expect(response.body).to.have.property('name')
        expect(response.body.email).to.be.equal(data.email)
        expect(response.body.name).to.be.equal(data.name)
      })

      it('Should return error - (Empty body, code: 400)', async function() {
        const data = {}

        const response = await chai
          .request(app)
          .post('/register')
          .send(data)

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Email is required')
        expect(response.body.errors).to.include('Name is required')
        expect(response.body.errors).to.include('Password is required')
      })

      it('Should return error - (Duplicate email, code: 400)', async function() {
        const data = {
          email: 'testing@email.com',
          name: 'testing',
          password: 'testing',
        }

        const response = await chai
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
      await chai
        .request(app)
        .post('/register')
        .send({
          name: 'testing',
          email: 'testing@email.com',
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
        expect(response.body).to.have.property('email')
        expect(response.body).to.have.property('name')
        expect(response.body.email).to.be.equal('testing@email.com')
        expect(response.body.name).to.be.equal('testing')
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
          .send({ email: 'testing@email.com', password: 'wrong password' })

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Email or password is wrong')
      })

      it('Should return error - (incorrect email and or passsword, code: 400)', async function() {
        const response = await chai
          .request(app)
          .post('/login')
          .send({ email: 'wrongemail@mail.com', password: 'testing' })

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Email or password is wrong')
      })
    })
  })
  describe('3. User profile', function() {
    before(async function() {
      let respone = await chai
        .request(app)
        .post('/register')
        .send({
          name: 'testing',
          email: 'testing2@email.com',
          password: 'testing',
        })
      user = respone.body

      await chai
        .request(app)
        .post('/travels')
        .set('token', user.token)
        .send({
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: '2020-02-21',
        })
    })

    after(async function() {
      User.deleteMany({})
    })

    describe('get user detail', function() {
      it('Should return token with status code 200', async function() {
        const response = await chai
          .request(app)
          .get('/users')
          .set('token', user.token)

        expect(response).to.have.status(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('items')
        expect(response.body.items).to.be.a('array')
        expect(response.body).to.have.property('carts')
        expect(response.body.carts).to.be.a('array')
        expect(response.body).to.have.property('travel')
        expect(response.body).to.have.property('user')
      })
    })
  })
})
