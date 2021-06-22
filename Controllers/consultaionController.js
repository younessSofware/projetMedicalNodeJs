const Malade = require('../Models/Malade');
const Patient = require('../Models/Patient');
const Consultation = require('../Models/Consultation');
const mongoose = require('mongoose')
exports.addConsultation = (req, res) => {
    const consultation = new Consultation(req.body);
    const {rapport} = req.files;
    consultation.rapport = rapport.data;
    consultation.save((err, result) => {
        if(err) res.status(400).json({
            message: "you have a err"
        });
        res.status(200).send(result);
    })
}
exports.modifyConsultation = (req, res) => {
    const {rapport, patient, malade, prediction, etat} = req.body
    console.log(patient)
    Consultation.findById(req.body._id).then(( constultation) => {
        if(rapport) constultation.rapport = rapport;
        if(patient) constultation.patient = patient;
        if(malade) constultation.malade = malade;
        if(prediction) constultation.prediction = prediction;
        if(etat != undefined) constultation.etat = etat;
        constultation.save();
        res.status(200).json({
            message: "successfully modified"
        });
    }).catch((err) => {
        res.status(400).send('err');
    });
};
exports.deleteConsultation = (req, res) => {
    const {_id} = req.body;
    Consultation.findByIdAndDelete(_id).then((constultation) => {
        res.status(200).json({
            message: "delete succcufuly"
        });
    }).catch((err) => {
            res.status(400).json({
                message: "cannot delete"
            });
    });
};

exports.getConstuationOfPatient = (req, res) => {
    const _idPatinet = req.query._id;
    Consultation.find({patient: _idPatinet}).exec().then((result) => {
        if(!result.length) res.status(400).json({
            err: "cannot find this consultation"
        });
        res.send(result);
    }, err => {
        res.status(400).send(err);
    });
}
exports.getConstuationOfMalade = (req, res) => {
    const _idMalade = req.query._id;
    Consultation.find({malade: _idMalade}).exec().then((result) => {
        if(!result.length) res.status(400).json({
            err: "cannot find this consultation"
        });
        res.send(result);
    }, err => {
        res.status(400).json({
            error: err
        });
    });
}