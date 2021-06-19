const express = require('express');
const router = express.Router();
const {hello, signup, signin, signout, signinByCamera, addConsultation, addPatient,addMalade, getAll } = require('../Controllers/usersController');
const { requireSignIn } =  require('./../middlowers/auth');
router.get('/', hello);

router.post('/signup', signup)
router.post('/signin', signin)
router.get('/signout', signout)
router.post('/signinByCamera', signinByCamera)

router.post('/addConsultation', addConsultation)
router.post('/addPatient', addPatient)
router.post('/addMalade', addMalade)

router.get('/getAll', getAll)

router.get("/hello",requireSignIn , (req, res) => {
    res.send("Hello there");
})
module.exports = router