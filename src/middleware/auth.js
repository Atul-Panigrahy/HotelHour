
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const auth = async (req,res,next) => {
    // console.log("auth middleware");
    // console.log(req.header);
    try {

        // const token = req.header('Authorization').replace('Bearer ', '')
        const token = req.cookies.jwt ;

        // console.log(`cookie token ${token}`);

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        // console.log('in middleware');
        // console.log(`user ${user}`);

        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {

        console.log('error in auth');
        res.status(401).render('signin')
        
        // res.status(401).send({error: 'Please authenticate.'});
    }
}

module.exports = auth