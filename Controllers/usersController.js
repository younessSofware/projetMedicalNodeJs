const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const mongoose = require('mongoose');
const Patient = require('../Models/Patient');
const Malade = require('../Models/Malade');

exports.hello = (req, res) => {
    res.send('hello');
}

exports.getUser = (req, res) => {
    const {_id} = req.query;
    User.findOne({_id: mongoose.Types.ObjectId(_id)}).exec((err, user) => {
        res.status(200).send(user);
    });
}

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.photos.push(req.files.files.data);
    user.save((err, result) => {
        if(err) res.status(400).send(err);
        res.status(200).send(result);
    });
}

exports.signin = (req, res) => {
    const user = new User(req.body);
    const {email, password} = req.body
    User.findOne({email: email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User not found with this user, Please Signup!"
            })
        }
        if(!user.authenticated(password)){
            return res.status(401).json({
                error: "I think you are forget your email or ur password"
            });
        }
        const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);
        res.cookie('token', token, {expire: new Date() + 999999});
        return res.json({
            token, user: user
        })
    })
}


var listFacesIds = [];
var faceId;
exports.signinByCamera = (req, res) => {
    faceId = req.body.faceIds;
    let query = User.find({});
    query.exec(function (err, objs) {
        if (err) return next(err);
        objs.map(obj => {
            let header =  {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': '648fe4cacb4f414c8c1b32ac30244eef'
            }
            axios.post(options.uri, obj.photos[0],{
                headers: header     
            }).then((resp) => {
                listFacesIds.push(resp.data[0].faceId);
                if(listFacesIds.length == objs.length){
                    verifyApi(obj._id, listFacesIds.pop(), res);
                }
            }).catch((err) => {
                console.log(err)
            });
        })
    });
}
const options = {
    uri: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400',
    verifyUri: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/verify',
    headers : {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '648fe4cacb4f414c8c1b32ac30244eef'
    }
};

function axiosMethods(faceId1, faceId2){
    const header = options.headers;
    return axios.post(options.verifyUri, {
        faceId1: faceId1,
        faceId2: faceId2
    },{
        headers: header     
   });
}

function verifyApi(_id, obj, res){
    if(!obj){
        listFacesIds = []
        res.status(401).json({
            message: "unauthorisated"
        });
        return;
    }
    axiosMethods(obj, faceId)
    .then((response) => {
        if(response.data.isIdentical){
            User.findById(_id).then((user) => {
                const token = jwt.sign({ _id: user._id}, process.env.JWT_SECRET);
                const {_id, nom, prenom, email, role } = user;
                res.status(200).json({
                    token, user: user
                });
                res.cookie('token', token, {expire: new Date() + 999999});
                return;
            });
        }else{
          return verifyApi(_id, listFacesIds.pop(), res);  
        }
    }).catch((err) => {
        res.status(401).send(JSON.stringify(err));
    })
}






exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'user Sign Out'
    })
}
exports.addConsultation = (req, res) => {
    const {consult_id, user_id} = req.body;
    User.findOne({_id: mongoose.Types.ObjectId(user_id) }).exec().then((user) => {
        if(!user) res.status(400)
        if(user.consultaion.indexOf(consult_id) == -1)  user.consultaion.push(consult_id);
        user.save();
        res.status(200).send('good')
    }, err => res.status(400))
}
exports.addPatient = (req, res) => {
    const {patient_id, user_id} = req.body;
    User.findOne({_id: mongoose.Types.ObjectId(user_id) }).exec().then((user) => {
        if(!user) res.status(400)
        if(user.patients.indexOf(patient_id) == -1)  user.patients.push(patient_id);
        user.save();
        res.status(200).send('good')
    }, err => res.status(400).send('err'))
}
exports.addMalade = (req, res) => {
    const {malade_id, user_id} = req.body;
    User.findOne({_id: mongoose.Types.ObjectId(user_id) }).exec().then((user) => {
        if(!user) res.status(400)
        if(user.malades.indexOf(malade_id) == -1)  user.malades.push(malade_id);
        user.save();
        res.status(200).send('good')
    }, err => res.status(400).send('err'))
}

exports.getAll = (req, res) => {
   const _userId = req.query._id; 
   User.findOne({_id: _userId}).populate('consultaion').populate('infermeris').populate('patients').populate('malades').exec((err, result) => {
       if(err) res.status(400).send();
       let count = 0;
       result.malades.map((malade, index) => {
            result.consultaion.map((consult) => {
                if(consult.malade.toString() == malade._id.toString()) count++;
            });
            let maladeOrigin = new Malade(malade);
            maladeOrigin.nbPatient = count;
            maladeOrigin.save()
            count = 0
       });
       // patient with etat and type of maladie
       res.status(200).json({
        consultations: result.consultaion,
        patients: result.patients,
        malades: result.malades,
        infermeris: result.infermeris
       });

   });
}
