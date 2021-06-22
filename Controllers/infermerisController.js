const Infermerie = require('../Models/Infermerie');
const User = require('../Models/User');
const mongoose = require('mongoose');
exports.addInfermerie= (req, res) => {
    const infermerie = new Infermerie(req.body);
    const {user_id} = req.body;
    infermerie.save((err, result) => {
        if(err) res.status(400).json({
            message: "you have a err"
        });
        User.findOne({_id: mongoose.Types.ObjectId(user_id)}).exec((err, user) => {
            if(err) res.status(400).json({
                message: "you have a err"
            });
            user.infermeris.push(result._id);
            user.save().then((err, success) => {
                res.status(200).send(result);
            })
        })
    })
}
exports.modifyInfermerie = (req, res) => {
    const {nom, prenom, email, phone } = req.body
    Infermerie.findById(req.body._id).then(( infermerie) => {
        if(nom) infermerie.nom = nom;
        if(prenom) infermerie.prenom = prenom;
        if(email) infermerie.email = email;
        if(phone) infermerie.phone = phone;
        infermerie.save();
        res.status(200).json({
            message: "successfully modified"
        });
    }).catch((err) => {
        res.status(400).send(err);
    });
};
exports.deleteInfermerie= (req, res) => {
    const {_id, user_id} = req.body;
    Infermerie.findByIdAndDelete({_id: mongoose.Types.ObjectId(_id)}).then(() => {
        User.findOne({_id: mongoose.Types.ObjectId(user_id)}).exec((err, user) => {
            if(err){
                res.status(400).json({
                    message: "cannot delete"
                });
            }
            const index = user.infermeris.findIndex(p_id => p_id == _id);
            user.infermeris.splice(index, 1);
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