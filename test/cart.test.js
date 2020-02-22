const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const app = require('../app')
const Travel = require('../models/travel')
const User = require('../models/user')
const { generateToken } = require('../helpers/jwt')

chai.use(chaiHttp)

let user, token

describe('TESTING CART', function() {
  before(async function() {
    user = await User.create({
      name: 'testing',
      email: 'testing@email.com',
      password: 'testing',
    })

    token = generateToken({ id: user.id })
  })

  after(async function() {
    await User.deleteMany({})
  })

  describe('1. Create Travel', function() {
    describe('Start create travel', function() {
      afterEach(async function() {
        await Travel.deleteMany({})
      })

      it('should return new travel document - (code: 201)', async function() {
        const data = {
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: '2020-02-21',
        }

        const response = await chai
          .request(app)
          .post('/travels')
          .set('token', token)
          .send(data)

        expect(response).to.have.status(201)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('locationFrom')
        expect(response.body).to.have.property('locationTo')
        expect(response.body.locationFrom).to.be.equal('Singapore')
        expect(response.body.locationTo).to.be.equal('Indonesia')
      })

      it('should return error - (missing body, code: 400)', async function() {
        const response = await chai
          .request(app)
          .post('/travels')
          .set('token', token)
          .send({})

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('locationFrom is missing')
        expect(response.body.errors).to.include('locationTo is missing')
        expect(response.body.errors).to.include('departure is missing')
      })

      it('should return error - (already have active travel, code: 400)', async function() {
        const data = {
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: '2020-02-21',
        }

        await chai
          .request(app)
          .post('/travels')
          .set('token', token)
          .send(data)

        const response = await chai
          .request(app)
          .post('/travels')
          .set('token', token)
          .send(data)

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Cant make another travel')
      })
    })
  })

  describe('2. Update Travel', function() {
    let travel
    before(async function() {
      travel = await Travel.create({
        userId: user.id,
        locationFrom: 'Singapore',
        locationTo: 'Indonesia',
        departure: '2020-02-21',
      })
    })

    after(async function() {
      await Travel.deleteMany({})
    })

    describe('Start update travel', function() {
      it('should return travel object - (code: 200)', async function() {
        const response = await chai
          .request(app)
          .patch(`/travels/${travel.id}`)
          .set('token', token)
          .send({ locationFrom: 'Jawa Tengah' })

        expect(response).to.have.status(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('locationFrom')
        expect(response.body).to.have.property('locationTo')
        expect(response.body.locationFrom).to.be.equal('Jawa Tengah')
        expect(response.body.locationTo).to.be.equal('Indonesia')
      })
    })
  })

  describe('3. Delete Travel', function() {
    let travel
    before(async function() {
      travel = await Travel.create({
        userId: user.id,
        locationFrom: 'Singapore',
        locationTo: 'Indonesia',
        departure: '2020-02-21',
      })
    })

    after(async function() {
      await Travel.deleteMany({})
    })

    describe('Start delete travel', function() {
      it('should return travel object - code(200)', async function() {
        const response = await chai
          .request(app)
          .delete(`/travels/${travel.id}`)
          .set('token', token)

        expect(response).to.have.status(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('locationFrom')
        expect(response.body).to.have.property('locationTo')
        expect(response.body.locationFrom).to.be.equal('Singapore')
        expect(response.body.locationTo).to.be.equal('Indonesia')
      })
    })
  })
})
