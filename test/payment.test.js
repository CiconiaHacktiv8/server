// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const expect = chai.expect

// const User = require('../models/user')

// const app = require('../app')

// chai.use(chaiHttp)

// let idPayment, user

// describe('PAYMENT TEST', function(){
//     before(async function() {
//        user = await chai
//           .request(app)
//           .post('/register')
//           .send({
//             name: 'testing',
//             email: 'testing@email.com',
//             password: 'testing',
//           })
//       })
  
//       after(async function() {
//         User.deleteMany({})
//       })

//     describe('1. Create Payment', function() {
//         it('Should return create invoice with status code 200', async function() {
//             const data = {
//             description: 'testing description',
//             amount: 100000,
//             }

//             const response = await chai
//             .request(app)
//             .post('/payment')
//             .set('token',user.body.token)
//             .send(data)
//             idPayment = response.body.id
//             expect(response).to.have.status(200)
//             expect(response.body).to.be.an('object')
//         })
//     })
//     describe('2. Get Payment', function() {
//         it('Should return data payment with status code 200', async function() {
//         const response = await chai
//             .request(app)
//             .get(`/payment/${idPayment}`)
//             .set('token',user.body.token)

//         expect(response).to.have.status(200)
//         expect(response.body).to.be.an('object')
//         })
//     })
// })