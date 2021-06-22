const Schema  = require('mongoose');
const mongoose  = require('mongoose');

const infermerieSchema = new mongoose.Schema({
    nom : {
        type: String,
        trim: true
    },
    prenom : {
        type: String,
        trim: true
    },
    email : {
        type: String,
        trim: true,
        unique: true
    },
    adresse : {
        type: String,
        trim: true  
    },
    phone : {
        type: String,
        default: '0653394653'
    },
}, {timestamps: true});

module.exports = mongoose.model('Infermerie', infermerieSchema);