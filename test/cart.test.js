const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const app = require('../app')
const Travel = require('../models/travel')
const User = require('../models/user')
const Cart = require('../models/cart')
const { generateToken } = require('../helpers/jwt')

const base64File = require('./base64file')

chai.use(chaiHttp)

let travelUser, travelToken, watchUser, watchToken, preOrderItem, requestItem, requestItem2, tempCart

describe.only('TESTING CART', function() {
  before(async function() {
    //create user1
    travelUser = await User.create({
      name: 'user',
      email: 'user@email.com',
      password: 'testing',
    })

    travelToken = generateToken({ id: travelUser.id })

    //create user2
    watchUser = await User.create({
      name: 'user2',
      email: 'user2@email.com',
      password: 'testing',
    })

    watchToken = generateToken({ id: watchUser.id })


    //create travel with id user1   
    await chai.request(app)
      .post('/travels')
      .set('token', travelToken)
      .send({
          locationFrom: 'Singapore',
          locationTo: 'Indonesia',
          departure: '2020-02-21',
        })
      .then((data) =>{
          console.log('created travel')
      })
      .catch(err=>{console.log(err)})
    
    //create preOrder from user who have travel
    await chai.request(app)
      .post('/items')
      .set('token', travelToken)
      .send({
          name: 'item preOrder',
          price: 99999,
          quantity: 1,
          imageName: 'testing.jpg',
          base64: base64File,
          status: 'travel', 
          location: 'Singapore'
        })
      .then((data) =>{
        this.timeout(10000)
          preOrderItem = data.body
      })
      .catch(err=>{console.log(err)})

    //create request item
    await chai.request(app)
      .post('/items')
      .set('token', watchToken)
      .send({
          name: 'item request',
          price: 10000,
          quantity: 2,
          imageName: 'testing.jpg',
          base64: base64File,
          status: 'watch', 
          location: 'Singapore'
        })
      .then((data) =>{
        this.timeout(10000)
          requestItem = data.body
      })
      .catch(err=>{console.log(err)})

    //create request item 2
    await chai.request(app)
    .post('/items')
    .set('token', watchToken)
    .send({
        name: 'item request',
        price: 10000,
        quantity: 2,
        imageName: 'testing.jpg',
        base64: base64File,
        status: 'watch', 
        location: 'Hongkong'
      })
    .then((data) =>{
      this.timeout(10000)
        requestItem2 = data.body
    })
    .catch(err=>{console.log(err)})

  })

  after(async function() {
    await User.deleteMany({})
    await Travel.deleteMany({})
    await Cart.deleteMany({})
  })

  describe('1. Create Cart', function() {
    describe('as Watcher', function() {
      it('should return new cart - watcher buy itemPreOrder from travel list item - (code: 201)', async function() {
        this.timeout(10000)
        const response = await chai
          .request(app)
          .post('/carts')
          .set('token', watchToken)
          .send({
            travelId : preOrderItem.ownerId,
            itemId: preOrderItem._id,
            quantity: 1,
            status: 'open',
            fixPrice:preOrderItem.price
          })
        tempCart = response.body
        expect(response).to.have.status(201)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('travelId')
        expect(response.body).to.have.property('buyerId')
        expect(response.body).to.have.property('quantity')
        expect(response.body).to.have.property('status')
        expect(response.body).to.have.property('fixPrice')
      })
      it('should return error - accepted itemRequest but dont have travel - (code: 400)', async function() {
        this.timeout(10000)
        const response = await chai
          .request(app)
          .post('/carts')
          .set('token', watchToken)
          .send({
            travelId : watchUser._id,
            itemId: requestItem._id,
            quantity: 1,
            status: 'offered',
            fixPrice: requestItem.price
        })

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors[0]).to.equal('You didnt have travel')
      })
    })
    describe('as Travel', function() {
      it('should return new cart - travel can buy itemRequest from watcher - (code: 201)', async function() {
        this.timeout(10000)
        const response = await chai
          .request(app)
          .post('/carts')
          .set('token', travelToken)
          .send({
            travelId : travelUser._id,
            itemId: requestItem._id,
            quantity: 1,
            status: 'offered',
            fixPrice: requestItem.price
          })

        expect(response).to.have.status(201)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('travelId')
        expect(response.body).to.have.property('buyerId')
        expect(response.body).to.have.property('quantity')
        expect(response.body).to.have.property('status')
        expect(response.body).to.have.property('fixPrice')
      })
      it('should return error - location item not match with travel from - (code: 400)', async function() {
        this.timeout(10000)
        const response = await chai
          .request(app)
          .post('/carts')
          .set('token', travelToken)
          .send({
            travelId : travelUser._id,
            itemId: requestItem2._id,
            quantity: 1,
            status: 'offered',
            fixPrice: requestItem.price
          })

        expect(response).to.have.status(400)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('errors')
        expect(response.body.errors[0]).to.equal('Item location different')
      })
    })    
  })
  describe('2. Get Cart', function() {
    describe('get one Cart',function(){
      it('should return one cart - (code: 200)',async function(){
        this.timeout(10000)
        const response = await chai
          .request(app)
          .get(`/carts/${tempCart._id}`)

        expect(response).to.have.status(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('travelId')
        expect(response.body).to.have.property('buyerId')
        expect(response.body).to.have.property('quantity')
        expect(response.body).to.have.property('status')
        expect(response.body).to.have.property('fixPrice')
      })
    })
    describe('get one Cart By User',function(){
      it('should return one cart - (code: 200)',async function(){
        this.timeout(10000)
        const response = await chai
          .request(app)
          .get(`/carts/${tempCart._id}`)

        expect(response).to.have.status(200)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('travelId')
        expect(response.body).to.have.property('buyerId')
        expect(response.body).to.have.property('quantity')
        expect(response.body).to.have.property('status')
        expect(response.body).to.have.property('fixPrice')
      })
    })    
  })

})
