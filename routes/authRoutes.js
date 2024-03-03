// // const express = require('express');
// // const router = express.Router();
// // const cors = require('cors');
// // const { test, registerUser } = require('../controllers/authControllers')

// // router.use(
// //     cors({
// //         credentials: true,
// //         origin: 'http://localhost:5173'
// //     })
// // )

// // router.get('/', test)
// // router.post('/register', registerUser)

// // module.exports = router    

// const express = require('express');
// const router = express.Router();
// const cors = require('cors');
// const { test, registerUser } = require('../controllers/authControllers')

// router.use(
//     cors({
//         credentials: true,
//         origin: 'http://localhost:5173'
//     })
// )

// router.get('/', test)
// router.post('/register', registerUser)

// // Error handling middleware
// router.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something went wrong!');
// });

// module.exports = router;