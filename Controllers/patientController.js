const Patient = require('../Models/Patient');
const Malade = require('../Models/Malade');

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
    const {_id} = req.body;
    Patient.findByIdAndDelete(_id).then(() => {
        res.status(200).json({
            message: "delete succcufuly"
        });
    }).catch((err) => {
            res.status(400).json({
                message: "cannot delete"
            });
    });
};

exports.getPatients = (req, res) => {
    Patient.find().exec().then((result) => {
        res.status(200).send(result);
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err);
    });
}
exports.getPatientsOfMalade = (req, res) => {
    const _id = req.query._id;
    const patients = [];
    Malade.findOne({_id : _id }).exec().then((result) => {
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

