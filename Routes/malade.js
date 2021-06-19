const express = require('express');
const router = express.Router();
const { requireSignIn } =  require('./../middlowers/auth');
const { addMalade, modifyMalade, deleteMalade, getMaladesOfPatient} = require('./../Controllers/maladesController');
router.post('/addMalade', addMalade);
router.post('/modifyMalade', modifyMalade);
router.post('/deleteMalade', deleteMalade);
router.get('/getMaladesOfPatient', getMaladesOfPatient);

module.exports = router