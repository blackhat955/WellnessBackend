const express = require('express');
const { OAuth2Client } = require('google-auth-library');
const router = express.Router();
// const User = require('../models/user');
// Initialize Google OAuth client
function getGoogleClinet(){
    return new OAuth2Client("564265705395-ijb65ipug7u0fsfeg9htsirit23ppqob.apps.googleusercontent.com");
}

function getUserDB(){
    const User = require('../models/User');;
    return User
}

function splitFullName(fullName) {
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    return { firstName, lastName };
}
// const googleClient = new OAuth2Client(process.env.o2auth_client_id);

// Google OAuth callback route
router.post('/google', async (req, res) => {
    try {
        const googleClient = getGoogleClinet()
        const { access_token } = req.body;
        // Verify Google access token
    
        const ticket = await googleClient.verifyIdToken({
            idToken: access_token,
            audience: process.env.o2auth_client_id,
        });

        const payload = ticket.getPayload();
        console.log(payload)
        const { sub, email, name } = payload; // Extract user information
        const User = getUserDB()
        let user = await User.findOne({ email });
        if (!user) {
            // User doesn't exist, create a new user
            let userTypex="customer"
            const { firstName, lastName } = splitFullName(name);
            const user = new User({ email, password: "xxx", firstname:firstName, userType:userTypex, lastname: lastName});
            const data = await user.save();
            res.status(200).send({ message: 'Registered successfully', data  });
        }else {
            console.log('this is user email id', user)
            const userdeets = {
                firstname : user.firstname,
                lastname  : user.lastname,
                email : user.email,
                userType : user.userType ? user.userType : " "
              }
            console.log(userdeets)
              res.status(200).send({ message: 'logged in',userDetails:userdeets});
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = router;