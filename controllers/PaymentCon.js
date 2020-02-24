const Xendit = require('xendit-node')
const { Invoice } = new Xendit({ secretKey: 'xnd_development_HCJgUJiLR7aQHkzuxY3KcwFllk2nm6786phNfehtPOEfuFZlUtY7npMBh5A6' })
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions)


class PaymentCon{
    static  createInvoice(req,res,next) {
             i.createInvoice({
                externalID: 'demo_1475801962607',
                amount: req.body.amount,
                payerEmail: req.payload.email,
                description: req.body.description,
            })
            .then((data)=>{
                res.status(200).json(data)
            })
            .catch(next)
     
    }

    static async getInvoice(req,res,next){
        const temp = await i.getInvoice({
            invoiceID: req.params.id
        })
      
        res.status(200).json(temp)
    }

}

module.exports = PaymentCon