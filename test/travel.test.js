const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

// const app = require('../app')
// const Travel = require('../models/travel')
// const User = require('../models/user')

describe('TESTING TRAVEL', function() {
  let user

  before(async function() {
    user = await chai
      .request(app)
      .post('/register')
      .data({
        email: 'testing@email.com',
        name: 'testing',
        password: 'testing',
      })
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
          departure: new Date(2020, 2, 21),
        }

        const response = chai
          .request(app)
          .post('/travels')
          .set('token', user.body.token)
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
        const response = chai
          .request(app)
          .post('/travels')
          .set('token', user.body.token)
          .send({})

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('locationFrom is missing')
        expect(response.body.errors).to.include('locationTo is missing')
        expect(response.body.errors).to.include('departure is missing')
      })

      it('should return error - (already have active travel, code: 403)', async function() {
        const data = {
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: new Date(2020, 2, 21),
        }

        await chai
          .request(app)
          .post('/travels')
          .set('token', user.body.token)
          .data(data)

        const response = chai
          .request(app)
          .post('/travels')
          .send(data)

        expect(response).to.have.status(403)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
        expect(response.body.errors).to.include('Travel already exists')
      })
    })
  })

  describe('2. Update Travel', function() {
    let travel
    before(async function() {
      travel = await chai
        .request(app)
        .post('/travels')
        .set('token', user.body.token)
        .send({
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: new Date(2020, 2, 21),
        })
    })

    after(async function() {
      await Travel.deleteMany({})
    })

    describe('Start update travel', function() {
      it('should return travel object - (code: 200)', async function() {
        const response = chai
          .request(app)
          .patch(`/travels/${travel._id}`)
          .set('token', user.body.token)
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
      travel = await chai
        .request(app)
        .post('/travels')
        .send({
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: new Date(2020, 2, 21),
        })
    })

    after(async function() {
      await Travel.deleteMany({})
    })

    describe('Start delete travel', function() {
      it('should return travel object - code(200)', async function() {
        const response = chai
          .request(app)
          .delete(`/travels/${travel._id}`)
          .set('token', user.body.token)

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
