const Schema = require('mongoose');
const mongoose = require('mongoose');
const uuid = require('uuid').v4;
const crypto = require('crypto');
const userSchema = new mongoose.Schema({
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
    salt : {
        type: String,
        default: '0653394653'
    },
    hashed_password : {
        type: String,
        required: true
    },
    specialisation: {
        type: String,
        required: true
    },
    nom_Clinique: {
        type: String,
        required: true
    },
    adresseClinique: {
        type: String,
        required: true
    },
    faceIds: {
        type: String,
        required: true
    },
    photos: {
        type: [Buffer],
        required: true
    },
    role: {
        type: Number,
        default: 0
    },
    malades: [{ type: Schema.Types.ObjectId, ref: 'Malade' }],
    patients: [{ type: Schema.Types.ObjectId, ref: 'Patient' }],
    consultaion: [{ type: Schema.Types.ObjectId, ref: 'Consultation' }]
}, {timestamps: true});

userSchema.virtual('password')
.set(function(password){
    this._password = password;
    this.salt = uuid();
    this.hashed_password = this.cryptPassword(password);
})
.get(() => {
    return this._password
});

userSchema.methods = {
    authenticated: function(plainText){
        console.log(this.hashed_password == plainText)
        return this.cryptPassword(plainText) === this.hashed_password
    },
    cryptPassword: function(password){
        if(!password) return 'error de pass';
        try{
            return crypto.createHmac('sha256', this.salt)
            .update(password)
            .digest('hex');
        }catch(err){
            console.log('54', err)
            return err; 
        }
    }
}
module.exports = mongoose.model('User', userSchema);