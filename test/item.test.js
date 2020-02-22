const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const app = require('../app')
let itemModel = require('../models/item')

chai.use(chaiHttp)

let itemWatcher = ''
let user = ''
let itemTravel = ''

describe.only('/testing item', function() {
    before( async function (){
        await  itemModel.deleteMany({name : 'item name'},function(err,data){
            if (err) {
                console.log(err)
              } else {
                console.log('delete succsess');
              }
        })
         await chai.request(app)
            .post('/login')
            .send({
                name:'user',
                email:'user@gmail.com',
                password:'123456'
            })
            .then((data) =>{
                user = data
            })
            .catch(err=>{console.log(err)})
    })     
  describe('Post item', function() {
      it('should return created item and status code 201', function(done) {
        chai.request(app)
            .post('/items')
            .set('token',user.body.token)
            .send({
                name: 'item name',
                price: 99999,
                quantity: 1,
                image: 'image url',
                status: 'travel', // input with travel or watch
                location: 'location item'
            })
            .then(function(res) {
                expect(res).to.have.status(201)
                expect(res.body).to.have.property('name').equal(res.body.name)
                expect(res.body).to.have.property('price').equal(res.body.price)
                expect(res.body).to.have.property('quantity').equal(res.body.quantity)
                expect(res.body).to.have.property('image').equal(res.body.image)
                expect(res.body).to.have.property('ownerId').equal(res.body.ownerId)
                expect(res.body).to.have.property('status').equal(res.body.status)
                expect(res.body).to.have.property('location').equal(res.body.location)
                itemTravel = res
                done()
            })
            .catch(done)
        })
        describe('Test validation name',function(){
            it('should return status 400 when object name is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: '',
                        price: 99999,
                        quantity: 1,
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('you must enter item name')
                        done()
                    })
                    .catch(done)
            })
        })      
        describe('Test validation price',function(){
            it('should return status 400 when object price less then 1000', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 500,
                        quantity: 1,
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('minimal price is 1000')
                        done()
                    })
                    .catch(done)
            })
            it('should return status 400 when object price is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: '',
                        quantity: 1,
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('you must enter item price')
                        done()
                    })
                    .catch(done)
            })
        })
        describe('Test validation quantity',function(){
            it('should return status 400 when object quantity less then 1', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 500,
                        quantity: 0,
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('minimal quantity is 1')
                        done()
                    })
                    .catch(done)
            })            
            it('should return status 201 and quantity equal with 1 when object quantity is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 99999,
                        quantity: '',
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(201)
                        expect(res.body).to.have.property('name').equal(res.body.name)
                        expect(res.body).to.have.property('price').equal(res.body.price)
                        expect(res.body).to.have.property('quantity').equal(1)
                        expect(res.body).to.have.property('image').equal(res.body.image)
                        expect(res.body).to.have.property('ownerId').equal(res.body.ownerId)
                        expect(res.body).to.have.property('status').equal(res.body.status)
                        expect(res.body).to.have.property('location').equal(res.body.location)
                        done()
                    })
                    .catch(done)
            })
        })                 
        describe('Test validation image',function(){
            it('should return status 400 when object image is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 99999,
                        quantity: 1,
                        image: '',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('you must enter item image')
                        done()
                    })
                    .catch(done)
            })
        })
        describe('Test validation token',function(){
            it('should return status 400 when object ownerId is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',`${user.body.token} + 123`)
                    .send({
                        name: 'item name',
                        price: 99999,
                        quantity: 1,
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(404)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('user not found')
                        done()
                    })
                    .catch(done)
            })
        })
        describe('Test validation status',function(){
            it('should return status 400 when object status is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 99999,
                        quantity: 1,
                        image: 'image url',
                        status: '', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('you must enter item status')
                        done()
                    })
                    .catch(done)
            })
            it('should return status 400 when object status is not travel or watch', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 99999,
                        quantity: 1,
                        image: 'image url',
                        status: 'itemStatus', // input with travel or watch
                        location: 'location item'
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('you must enter with travel or watch')
                        done()
                    })
                    .catch(done)
            })            
        })
        describe('Test validation location',function(){
            it('should return status 400 when object location is empty', function(done){
                chai.request(app)
                    .post('/items')
                    .set('token',user.body.token)
                    .send({
                        name: 'item name',
                        price: 99999,
                        quantity: 1,
                        image: 'image url',
                        status: 'travel', // input with travel or watch
                        location: ''
                    })
                    .then(function(res){
                        expect(res).to.have.status(400)
                        expect(res.body).to.have.property('message')
                        expect(res.body.message[0]).to.equal('you must enter item location')
                        done()
                    })
                    .catch(done)
            })
        })                                               
  })

  describe('Get item', function(){
      it('should return all item and status code 200', function(done){
            chai.request(app)
                .get('/items')
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    // expect(res.body[(res.body.length) -1]).have.property('name').to.be.a('string')
                    // expect(res.body[(res.body.length) -1]).have.property('price').to.be.a('number')
                    // expect(res.body[(res.body.length) -1]).have.property('quantity').to.be.a('number')
                    // expect(res.body[(res.body.length) -1]).have.property('image').to.be.a('string')
                    // expect(res.body[(res.body.length) -1]).have.property('ownerId').to.be.a('string')
                    // expect(res.body[(res.body.length) -1]).have.property('status').to.be.a('string')
                    // expect(res.body[(res.body.length) -1]).have.property('location').to.be.a('string')
                    done()                    
                })
                .catch(done)
      })
  })
  describe('Get item by itemId', function(){
    before(async function(){
        itemWatcher =  await chai.request(app)
              .post('/items')
              .set('token',user.body.token)
              .send({
                  name: 'item name',
                  price: 99999,
                  quantity: 1,
                  image: 'image url',
                  status: 'watch', // input with travel or watch
                  location: 'location item'
              })
      }) 
      it('should return one item and status code 200', function(done){
            chai.request(app)
                .get(`/items/${itemWatcher.body._id}`)
                .then(function(res){
                    expect(res).to.have.status(200)
                    expect(res.body).have.property('name').to.be.a('string')
                    expect(res.body).have.property('price').to.be.a('number')
                    expect(res.body).have.property('quantity').to.be.a('number')
                    expect(res.body).have.property('image').to.be.a('string')
                    expect(res.body).have.property('ownerId').to.be.a('string')
                    expect(res.body).have.property('status').to.be.a('string')
                    expect(res.body).have.property('location').to.be.a('string')
                    done()                    
                })
                .catch(done)
      })
      it('should return status code 404 when id item is invalid',function(done){
            chai.request(app)
                .get(`/items/${itemWatcher.body._id} + 123`)
                .then(function(res){
                    expect(res).to.have.status(404)
                    expect(res.body.message).to.equal('item not found')
                })
                .catch(done)
      })
  })
  describe('Update item by id', function(){
      describe('Update one item by owner', function(){
        it('should return status code 200 when update item', function(done) {
            chai.request(app)
                .put(`/items/${itemWatcher.body._id}`)
                .set('token', user.body.token)
                .send({
                    image: 'image url new',
                    location: 'location item new'
                })
                .then(function(res) {
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.property('name').equal(res.body.name)
                    expect(res.body).to.have.property('price').equal(res.body.price)
                    expect(res.body).to.have.property('quantity').equal(res.body.quantity)
                    expect(res.body).to.have.property('image').equal(res.body.image)
                    expect(res.body).to.have.property('status').equal(res.body.status)
                    expect(res.body).to.have.property('location').equal(res.body.location)
                    done()
                })
                .catch(done)
        })  
        it('should return status code 400 when update item and status is travel', function(done) {
            chai.request(app)
                .put(`/items/${itemTravel.body._id}`)
                .set('token', user.body.token)
                .send({
                    image: 'image url new',
                    location: 'location item new'
                })
                .then(function(res) {
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.property('message')
                    expect(res.body.message[0]).to.equal('status item is Travel')
                    done()
                })
                .catch(done)
        })                 
      })
      describe('test authorize item', function(){
        it('should return status code 401 when update item with invalid token', function(done) {
            chai.request(app)
                .put(`/items/${itemWatcher.body._id}`)
                .set('token',`${user.body.token} + 000`)
                .send({
                    quantity: 2,
                    image: 'image url new',
                    location: 'location item new'
                })
                .then(function(res) {
                    expect(res).to.have.status(401)
                    expect(res.body).to.have.property('message')
                    expect(res.body.message[0]).to.equal('Not Authorized')
                    done()
                })
                .catch(done)
        })          
      })      
  })
  describe('Update price and status from watch to travel',function(){
    it('should return status code 200 when update item', function(done) {
        chai.request(app)
            .patch(`/items/${itemWatcher.body._id}`)
            .set('token', user.body.token)
            .send({
                status: 'travel',
                price: 1000000
            })
            .then(function(res) {
                expect(res).to.have.status(200)
                done()
            })
            .catch(done)
    }) 
    it('should return status code 400 when update item and status item is travel', function(done) {
        chai.request(app)
            .patch(`/items/${itemWatcher.body._id}`)
            .set('token', user.body.token)
            .send({
                status: 'travel',
                price: 1000000
            })
            .then(function(res) {
                expect(res).to.have.status(400)
                expect(res.body).to.have.property('message')
                expect(res.body.message[0]).to.equal('status item is Travel')                
                done()
            })
            .catch(done)
    })     
  })
  describe('Delete item',function(){
      it('should return status code 200 when delete item and item not in cart', function(done){
            chai.request(app)
                .delete(`/items/${itemWatcher.body._id}`)
                .set('token', user.body.token)
                .then(function(res){
                    expect(res).to.have.status(200)
                    done()
                })
                .catch(done)
      })
  })
    

})