import express from 'express' 
import { isAdmin } from '../../middlewares/auth.js'


import { createUser  , getAllUsers , getUser  ,deleteUser} from '../../controllers/user/User.controller.js'

const userRouter = express.Router() 



  

userRouter.get('/user' , (req , res)=>{
    res.send('hello')
    console.log('hello')
})




userRouter.post('/new' ,createUser) ; 
userRouter.get('/all' ,isAdmin , getAllUsers )
userRouter.get('/:id'  ,getUser )

userRouter.post('/:id' ,isAdmin ,  deleteUser)


export default userRouter