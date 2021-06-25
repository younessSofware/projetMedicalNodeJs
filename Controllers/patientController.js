const Patient = require('../Models/Patient');
const Malade = require('../Models/Malade');
const User = require('../Models/User');

const mongoose = require('mongoose');
exports.addPatientToUser= (req, res) => {
    const patient = new Patient(req.body);
    const { user_id } = req.body;

    patient.save((err, result) => {
        User.findOne({_id: mongoose.Types.ObjectId(user_id)}).exec((err, user) => {
            user.patients.push(result._id);
            if(err) res.status(400).json({
                message: "you have a err"
            });
            user.save();
            res.status(200).send(result);
        })
    })
}
exports.addPatient= (req, res) => {
    const patient = new Patient(req.body);
    patient.save((err, result) => {
        if(err) res.status(400).json({
            message: "you have a err"
        });
        res.status(200).send(result);
    })
}
exports.modifyPatient = (req, res) => {
    const {nom, prenom, email, phone, malades} = req.body
    Patient.findById(req.body._id).then(( patient) => {
        if(nom) patient.nom = nom;
        if(prenom) patient.prenom = prenom;
        if(email) patient.email = email;
        if(phone) patient.phone = phone;
        if(malades) patient.malades = malades;
        patient.save();
        res.status(200).json({
            message: "successfully modified"
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
};
exports.deletePatient= (req, res) => {
    const {_id, user_id} = req.body;
    Patient.findByIdAndDelete({_id: mongoose.Types.ObjectId(_id)}).then(() => {
        User.findOne({_id: mongoose.Types.ObjectId(user_id)}).exec((err, user) => {
            if(err){
                res.status(400).json({
                    message: "cannot delete"
                });
            }
            const index = user.patients.findIndex(p_id => p_id == _id);
            user.patients.splice(index, 1);
            user.save();
            res.status(200).json({
                message: "delete succcufully"
            });
        });
    }).catch((err) => {
            res.status(400).json({
                message: "cannot delete"
            });
    });
};

exports.getPatients = (req, res) => {
    const {_id} = req.query;
    Patient.find({ _id: mongoose.Types.ObjectId(_id)}).exec().then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err);
    });
}
exports.getPatientsOfMalade = (req, res) => {
    const _id = req.query._id;
    const patients = [];
    Malade.findOne({_id :  mongoose.Types.ObjectId(_id)}).exec().then((result) => {
        if(!result) res.status(400).send(result);
        Patient.find({malades: { $eq: {_id: result._id} }}).exec().then((patients) => {
            res.status(200).json({
                patients: patients,
                nomOfMalade: result.nom
            });
        }).catch((err) => {
            console.log(err)
            res.status(400).send(err);
        });
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err);
    });
}

