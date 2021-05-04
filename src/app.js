
const express = require('express')
const cookieParser = require('cookie-parser');
require('./db/mongoose')
const path = require('path')
const  User  = require('../src/models/user')
const userRouter = require('./routers/user')
const auth = require('./middleware/auth')

const nocache = require('nocache');
const multer = require('multer')
const sharp = require('sharp')


const app = express()
app.use(express.json())
app.use(userRouter)
app.use(cookieParser())

app.use(express.urlencoded({ extended: false }))

const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path))
app.set('view engine', "hbs")

app.use(nocache()); //prevents caching of protected pages



//=======================
//      R O U T E S
//=======================

app.get("/", (req, res) => {
    // res.send("hello From app.js")
    res.render('index')
})

app.get("/about", (req, res) => {

    res.render('about', {
        ErrorMessage: "[ NONE ]"
    })
})

app.get("/contact", (req, res) => {

    res.render('contact', {
        ErrorMessage: "[ NONE ]"
    })
})

app.get("/signup", (req, res) => {

    res.render('signup', {
        ErrorMessage: "[ NONE ]"
    })
})

app.post("/signup", async (req, res) => {

    // console.log(req.body);

    try {

        const userName = req.body.signupInputUserName.trim()
        const email = req.body.signupInputEmail.trim()
        const password = req.body.signupInputPassword.trim()
        const confirmPassword = req.body.signupInputConfirmPassword.trim()

        if (userName == "" || email == "" || password == "") {

            throw { error: 'User-name or e-mail or  Password can not left blank' }
        }
        else if (password.length < 8 || password.length > 20) {

            throw { error: 'Password Must be 8-20 characters long.' }
        }
        else if (password !== confirmPassword) {

            throw { error: 'provided passwords are not matching' }
        }

        const user = new User({
            name: userName,
            email: email,
            password: password

        })


        const token = await user.generateAuthToken()

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true
        });

        await user.save()
        res.status(201).redirect('/dashBoard');

    } catch (e) {

        res.status(400).redirect('/signup')
        // res.status(400).send({error: "Provide valid information"});
    }

})


app.get("/signin", (req, res) => {

    res.render('signin', {
        ErrorMessage: "[ NONE ]"
    })
})

app.post('/signin', async (req, res) => {

    const email = req.body.signinInputEmail.trim()
    const password = req.body.signinInputPassword.trim()



    try {

        if (email == "" || password == "") {

            throw (' e-mail or  Password can not left blank')
        }


        const user = await User.findByCredentials(email, password)

        if (!user) {
            throw ('Unable to login')
        }

        const token = await user.generateAuthToken()

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 60 * 60 * 1000),
            httpOnly: true
        });

        res.status(201).redirect('/dashBoard');

        // res.status(201).send({message: "Login successful",token:token})


    } catch (e) {

        res.redirect('/signin')
        // res.status(400).send(e)
    }
})

// app.get('/text', auth, async (req, res) => {
//     try {

//     } catch (error) {
//         res.status(500).send(error);    
//     }
// })

app.get('/dashBoard', auth, async (req, res) => {


    try {

        res.render('dashBoard', {
            // imageSource: "/img/default-avatar.png",
            imageSource: "data:/image/png;base64," + req.user.avatar,
            userName: req.user.name,
            email: req.user.email,
            ErrorMessage: "[ NONE ]"
        })
    } catch (error) {

        res.status(500).redirect('/signin')
    }
})



app.get('/user/update', auth, async (req, res) => {

    res.render('userUpdate', {
        type: "message:",
        message: "Apply appropriate changes to your profile"
    });

})

app.post('/users/me', auth, async (req, res) => {

    try {

        // console.log("inside router");
        // console.log(req.body);
        const userName = req.body.name.trim()
        const email = req.body.email.trim()
        const password = req.body.password.trim()
        const confirmPassword = req.body.ConfirmPassword.trim()

        if (userName == "" && email == "" && password == "") {

            throw { error: 'User-name and e-mail and  Password can not left blank' }
        }
        else if (password != "" && password.length < 8 || password.length > 20) {

            throw { error: 'Password Must be 8-20 characters long.' }
        }
        else if (password !== confirmPassword) {

            throw { error: 'provided passwords are not matching' }
        }

        if (userName != "")
            req.user.name = userName;

        if (email != "")
            req.user.email = email;

        if (password != "")
            req.user.password = password;

        await req.user.save()

        res.status(201).redirect('/dashBoard');

    } catch (e) {

        res.status(400).redirect('/user/update');
    }
})



//upload profile pic
const upload = multer({
    // dest: 'avatars',  // saves picture directly to the provided destination 

    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {// cb is the callback function

        if (!file || !file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a JPEG or JPG or PNG Picture'))
        }

        cb(null, true)
    }
})

var avatarUpload = upload.single('avatar')


app.post('/users/me/avatar', auth, async (req, res) => {

    // req.file = req.body.userAvatar; 


    try {

        avatarUpload(req, res, async function (error) {
            if (error) { //instanceof multer.MulterError
                res.status(500);
                if (error.code == 'LIMIT_FILE_SIZE') {
                    // error.message = 'File Size is too large. Allowed fil size is 200KB';
                    // error.success = false;
                    //  res.redirect('dashBoard',{
                    //     ErrorMessage: "File Size is too large. Allowed fil size is 200KB"
                    // });
                    res.redirect('/dashBoard')
                }
                return
            } else {
                if (!req.file) {
                    // res.status(500);
                    // res.json('file not found');
                    // return res.status(500).redirect('/dashBoard',{
                    //     ErrorMessage: "file not found"
                    // });
                    return res.status(500).redirect('/dashBoard')
                }
                // res.status(200);
                // res.json({
                //     success: true,
                //     message: 'File uploaded successfully!'
                // });
                const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer()

                req.user.avatar = buffer.toString('base64')

                await req.user.save()

                // console.log("image upload successful");
                res.redirect('/dashBoard');
            }
        })

        // console.log(req.file);   

        // const buffer = await sharp(req.file.buffer).resize({ width: 200, height: 200 }).png().toBuffer()

        // req.user.avatar = buffer.toString('base64')

        // await req.user.save()

        // // console.log("image upload successful");
        // res.redirect('/dashBoard');

    } catch (error) {

        // console.log(error);
        res.status(500).redirect('/dashBoard')
    }

}, (error, req, res, next) => {

    // console.log( error.message);
    res.status(500).redirect('/dashBoard')
    // res.status(400).send({ error: error.message })// sends nice json data instead of large HTML error data with unnecessary info.

})

//router to delete avatar
// app.delete('/users/me/avatar', auth, async (req, res) => {

//     try {

//         req.user.avatar = undefined
//         await req.user.save()

//         res.send()
//     } catch (e) {
//         res.status(500).send(e)
//     }

// })


app.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        res.clearCookie('jwt')
        // console.log('user logged out');

        await req.user.save()

        res.redirect('/');
        //    console.log({message:"Logout Successful"});

    } catch (e) {

        res.status(500).redirect('/signin')
        // res.status(500).send({error:'something went wrong'})
    }
})

app.get('*', (req, res) => {

    res.render('error');

})

module.exports = app
