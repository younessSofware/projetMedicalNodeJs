const mongoose = require('mongoose') 
const Schema  = require('mongoose');
const messageSchema = new mongoose.Schema({
    subject : {
        type: String,
        trim: true
    },
    files : {
        type: [Buffer],
    },
    isRead: {
        type: Boolean,
        trim: true
    },
    fromDoctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    toDoctorId: { type: Schema.Types.ObjectId, ref: 'User' },
    fromPatientId: { type: Schema.Types.ObjectId, ref: 'Patient' },
    toPatientId: { type: Schema.Types.ObjectId, ref: 'Patient' }
}, {timestamps: true});
module.exports = mongoose.model('Message', messageSchema);