const express = require('express');
const router = express.Router();
const { requireSignIn } =  require('./../middlowers/auth');
const { addPatient, modifyPatient,deletePatient, getPatients, getPatientsOfMalade} = require('./../Controllers/patientController');
router.post('/addPatient', addPatient);
router.post('/modifyPatient', modifyPatient);
router.post('/deletePatient', deletePatient);
router.get('/getPatients', getPatients);
router.get('/getPatientsOfMalade', getPatientsOfMalade);



module.exports = router