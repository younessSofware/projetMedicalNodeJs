const mongoose = require('mongoose')
const Message = require('../Models/Message');
const Patient = require('../Models/Patient');
const User = require('../Models/User');
exports.envoyer = (req, res) => {
    const {toId, fromId, subject} = req.body; 
    const message = new Message();
    if(subject != 'undefined') {
        message.subject = subject;
    }
    if(req.files){
        const files = req.files.files;
        if(files.length){
            files.map(file => message.files.push(file.data));
        }else{
            message.files.push(files.data);
        }
    }
    User.findOne({_id: mongoose.Types.ObjectId(fromId)}).exec().then((user) => {
        if(!user) return
        message.fromDoctorId = fromId;
        message.toPatientId = toId;
        message.save().then((messageSaved) => {
            user.messages.push(messageSaved._id);
            Patient.findOne({_id: mongoose.Types.ObjectId(toId)}).exec().then((patient) => {
                patient.messages.push(messageSaved._id);
                user.save().then(() => patient.save());
            });
            res.status(200).json({
                message: messageSaved
            });
        });

    });
    User.findOne({_id: mongoose.Types.ObjectId(toId)}).exec().then((user) => {
        if(!user) return;
        message.toDoctorId =  toId;
        message.fromPatientId = fromId;
        message.save().then((messageSaved) => {
            user.messages.push(messageSaved._id);
            Patient.findOne({_id: mongoose.Types.ObjectId(fromId)}).exec().then((patient) => {
                patient.messages.push(messageSaved._id);
                user.save().then(() => patient.save());
            });
            res.status(200).json({
                message: messageSaved
            });
        });
    })
}

exports.get = (req, res) => {
    //fromDoctorId
    //fromPatientId
    //fromPatientId
    //toPatientId
    const {doctorId, patientId} = req.query;
    let messages = [];
    Message.find({fromDoctorId: doctorId ,toPatientId: patientId}).exec((err, msgs) => {
        if(err) res.status(400).send();
        messages = messages.concat(msgs);
        Message.find({fromPatientId: patientId ,toDoctorId:  doctorId}).exec((err, msgs) => {
            if(err) res.status(400).send()
            messages = messages.concat(msgs);
            res.status(200).send(messages)
        });
    });

}