// const {UserModel} = require('../models/User')

// const test = (req, res) => {
//     res.json('test is working')
// }

// const registerUser = async(req, res) => {
//     try {
//         const {name, email, password} = req.body;

//         //Check Name Validation
//         if(!name){
//             return res.json({
//                 error: 'name is a required field',
//             })
//         };
        
//         // Password Validation
//         if(!password || password.length < 8){
//             return res.json({
//                 error:  'Password is required and should contain atleast 8 characters'
//             })
//         };

//         // Email Validation
//         const exist = await UserModel.findOne({email});

//         if(email){
//             return res.json({
//                 error: 'This email already exists',
//             })
//         };

//         const user = await UserModel.create({
//             name, email, password
//         });

//         return res.json(user)
//     } catch ( error ) {
//         console.log(error)
//     }
// }

// module.exports = {
//     test,
//     registerUser
// }