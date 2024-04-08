import express from 'express'
const paymentRouter = express.Router()
import { newCoupon  , newDiscount  ,allCoupons ,deleteCoupon , paymentInitiate } from '../../controllers/payment/Payment.controller.js'
import { isAdmin } from '../../middlewares/auth.js'

paymentRouter.get('/' , (req , res)=>{
    res.send('hello')
})


paymentRouter.post('/create' , paymentInitiate )


paymentRouter.post('/coupon/new' ,isAdmin , newCoupon )

paymentRouter.get('/discount' ,newDiscount )

paymentRouter.get('/coupon/all' , isAdmin , allCoupons)
paymentRouter.post('/coupon/delete/:id' , isAdmin , deleteCoupon)






export default paymentRouter