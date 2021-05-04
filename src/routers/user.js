const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const account = require('../emails/account')

const router = new express.Router()

// router.post('/signup', async (req,res)=>{

//     // console.log("success ful ");
// console.log(req.body);
// try{

//         const userName = req.body.signupInputUserName.trim()
//         const email = req.body.signupInputEmail.trim()
//         const password = req.body.signupInputPassword.trim()
//         const confirmPassword = req.body.signupInputConfirmPassword.trim()

//         // if (userName == "" || email == "" || password == "" ) {

//         //     throw {error:'User-name or e-mail or  Password can not left blank'}
//         // }  
//         // else if(password.length < 8 || password.length >20 ){

//         //     throw {error:'Password Must be 8-20 characters long.'}
//         // }
//         // else if(password !== confirmPassword){

//         //     throw {error:'provided passwords are not matching'}
//         // }

//         // const user = new User(req.body);
//         const user = new User({
//             name: userName,
//             email: email,
//             password: password

//         })
//         console.log(user);

//         await user.save()
//         // account.sendWelcomeEmail(user.email, user.name) //although this function is asynchrounous
//         // and we can use await with it but its not necessaary to send email and node has no need to wait for email to be sent
//         const token = await user.generateAuthToken()
//         res.status(201).send({user, token})
//         res.status(201).render('dashBoard')

//     }catch (e) {

//         res.status(400).send(e)
//     }


// })

// router.post('/users/login',async (req,res) => {
//     try {
//         const user = await User.findByCredentials(req.body.email, req.body.password)
//         const token = await user.generateAuthToken()

//         res.send({user, token})
//         // res.send({user:user.getPublicProfile(), token}) //restrict data sending


//     } catch (e) {

//         res.status(400).send()
//     }
// })

// router.post('/users/logout', auth,async (req,res) => {
//     try {
//         req.user.tokens = req.user.tokens.filter((token)=>{
//             return token.token != req.token
//         })
//         await req.user.save()
//         res.render('index') 

//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.post('/users/logoutAll', auth, async (req, res) => {
//     try {
//         req.user.tokens = []
//         await req.user.save()
//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })

// router.get('/users', auth, async(req,res) => {

//     // User.find({}).then((users)=>{
//     //     res.send(users)
//     // }).catch((e) => {
//     //     //internal server error like server connection lost
//     //     res.status(500).send(e)
//     // })

//     try{
//         const users = await User.find({})
//         res.send(users)
//     }catch (e) {

//         res.status(500).send(e)
//     }
// })

// router.get('/users/me', auth, async (req, res) => {
//     res.send(req.user)
// })

/*
// :is is the route parameter which is dynamic and will change value as the client provides
router.get('/users/:id',async (req,res) => {
    //route parameter
    // console.log(req.params)

    const _id =  req.params.id 

    // User.findById(_id).then( (user) => {
    //     //if there is no user
    //     if(!user){
            
    //         return res.status(404).send()
    //     }
    //     res.send(user)

    // }).catch((e) => {

    //     res.status(500).send(e)
    // })

    try{

        const user = await User.findById(_id)
        if(!user){
        return res.status(404).send()
        }
        res.send(user)

    }catch (e) {

        res.status(500).send(e)
    }
    
})
*/

// router.patch('/users/:id', async (req,res)=>{



// router.delete('/users/:id', auth, async(req,res)=>{
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // const user = await User.findByIdAndDelete(req.user._id)

        // becoz we are authenticating no need to check if a user exist or not
        // if(!user){
        //     return res.status(404).send()
        // }

        await req.user.remove()
        account.sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)

    } catch (e) {

        res.status(500).send(e)
    }
})

//upload profile pic
// const upload = multer({
//     // dest: 'avatars',  // saves picture directly to the provided destination 

//     limits: {
//         fileSize: 1000000 //1 mega byte 
//     },
//     fileFilter(req, file, cb) {// cb is the callback function

//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload a JPEG or JPG or PNG Picture'))
//         }

//         cb(undefined, true)
//     }
// })

// router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

//     const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()

//     // req.user.avatar = req.file.buffer
//     req.user.avatar = buffer
//     await req.user.save()

//     res.send()

// }, (error, req, res, next) => {

//     res.status(400).send({ error: error.message })// sends nice json data instead of large HTML error data with unnecessary info.

// })


//router to delete avatar
// router.delete('/users/me/avatar', auth, async (req, res) => {

//     try {

//         req.user.avatar = undefined
//         await req.user.save()

//         res.send()
//     } catch (e) {
//         res.status(500).send(e)
//     }

// })
    
//fetching the avatar
router.get('/users/:id/avatar', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send(e)

    }
})


module.exports = router