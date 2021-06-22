const Malade = require('../Models/Malade');
const Patient = require('../Models/Patient');
const mongoose = require('mongoose')
exports.addMalade = (req, res) => {
    const malade = new Malade(req.body);
    malade.save((err, result) => {
        if(err) res.status(400).json({
            message: "you have a err"
        });
        res.status(200).send(result);
    })
}
exports.modifyMalade = (req, res) => {
    const {icon, nom, medicaments} = req.body
    Malade.findById(req.body._id).then(( malade) => {
        if(icon) malade.icon = icon;
        if(nom) malade.nom = nom;
        if(medicaments) malade.medicaments = medicaments;
        malade.save();
        res.status(200).json({
            message: "successfully modified"
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
};
exports.deleteMalade = (req, res) => {
    const {_id} = req.body;
    Malade.findByIdAndDelete(_id).then((malade) => {
        res.status(200).json({
            message: "delete succcufuly"
        });
    }).catch((err) => {
            res.status(400).json({
                message: "cannot delete"
            });
    });
};


exports.getMaladesOfPatient = (req, res) => {
    const idPatient = req.query._id;
    const malades = [];
    Patient.findOne({_id: mongoose.Types.ObjectId(idPatient) }).exec().then((patient) => {
        patient.malades.map((malade, index) => {
            Malade.findOne({_id: malade._id}).exec().then((result) => {
                if(result){
                    malades.push(result);
                    if(index == patient.malades.length -1 ){
                        res.send(malades)
                    }
                }else{
                    res.status(400).json(({
                        message: "err"
                    }))
                }
            })
        });
    });
}