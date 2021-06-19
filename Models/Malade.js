const mongoose = require('mongoose') 
const maladeSchema = new mongoose.Schema({
    nom : {
        type: String,
        trim: true
    },
    icon : {
        type: String,
        trim: true
    },
    nbPatient: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Malade', maladeSchema);