const Xendit = require('xendit-node')
const { Invoice } = new Xendit({ secretKey: process.env.SECRET_KEY_XENDIT })
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions)

/* istanbul ignore next */
class PaymentCon{
    static async  createInvoice(req,res,next) {
          const temp =  await i.createInvoice({
                externalID: 'demo_1475801962607',
                amount: req.body.amount,
                payerEmail: req.payload.email,
                description: req.body.description,
            })
            
                res.status(200).json(temp)
           
     
    }

    static async getInvoice(req,res,next){
        const temp = await i.getInvoice({
            invoiceID: req.params.id
        })
      
        res.status(200).json(temp)
    }

}

module.exports = PaymentCon