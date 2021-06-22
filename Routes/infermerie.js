const express = require('express');
const router = express.Router();
const { requireSignIn } =  require('./../middlowers/auth');
const { addInfermerie, modifyInfermerie, deleteInfermerie} = require('./../Controllers/infermerisController');
router.post('/addInfermerie', addInfermerie);
router.post('/modifyInfermerie', modifyInfermerie);
router.post('/deleteInfermerie', deleteInfermerie);


module.exports = router