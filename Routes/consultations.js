const express = require('express');
const router = express.Router();
const { requireSignIn } =  require('./../middlowers/auth');
const { addConsultation, modifyConsultation,deleteConsultation, getConstuationOfPatient,getConstuationOfMalade } = require('./../Controllers/consultaionController');
router.post('/addConsultation', addConsultation);
router.post('/modifyConsultation', modifyConsultation);
router.post('/deleteConsultation', deleteConsultation);
router.get('/modifyConsultation', modifyConsultation);
router.get('/getConstuationOfPatient', getConstuationOfPatient);
router.get('/getConstuationOfMalade', getConstuationOfMalade);





module.exports = router