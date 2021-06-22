const express = require('express');
const router = express.Router();
const { envoyer, get } = require('./../Controllers/messagesController');

router.post('/envoyer', envoyer);
router.get('/get', get);

module.exports = router