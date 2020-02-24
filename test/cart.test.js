const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const app = require('../app')
const Travel = require('../models/travel')
const User = require('../models/user')
const Cart = require('../')
const { generateToken } = require('../helpers/jwt')

chai.use(chaiHttp)

let travelUser, travelToken, watchUser, watchToken, itemPreorder

describe('TESTING CART', function() {
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
          image: 'image url',
          status: 'travel', 
          location: 'location item'
        })
      .then((data) =>{
        console.log(data.body,'masukkk')
          itemPreorder = data.body
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

        const response = await chai
          .request(app)
          .post('/carts')
          .set('token', watchToken)
          .send({
            // travelId = itemPreorder.ownerId,
            // itemId= itemPreorder.id,
            // quantity= 1,
            // status= 'open',
            // fixPrice=itemPreorder.price
        })

        expect(response).to.have.status(201)
        expect(response.body).to.be.an('object')
        expect(response.body).to.have.property('_id')
        expect(response.body).to.have.property('travelId')
        expect(response.body).to.have.property('buyerId')
        expect(response.body).to.have.property('itemId')
        expect(response.body).to.have.property('quantity')
        expect(response.body).to.have.property('status')
        expect(response.body).to.have.property('fixPrice')
      })
    })
  })

})
