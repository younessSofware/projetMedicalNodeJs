const Schema  = require('mongoose');
const mongoose  = require('mongoose');

const Malade = require('./Malade')
const patientSchema = new mongoose.Schema({
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
    malades: [{ type: Schema.Types.ObjectId, ref: 'Malade' }]
}, {timestamps: true});

module.exports = mongoose.model('Patient', patientSchema);