const mongoose = require('mongoose');
const Schema  = require('mongoose');

const consultationSchema = new mongoose.Schema({
  rapport:{
      type: Buffer
  },
  patient:{
      type: Schema.Types.ObjectId, ref: 'Patient' 
  },
  malade:{
    type: Schema.Types.ObjectId, ref: 'Malade'
  },
  prediction: {
      type: String
  },
  etat: {
      type: Boolean
  }
}, {timestamps: true});
module.exports = mongoose.model('Consultation', consultationSchema);