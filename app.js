const express  = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
var bodyParser = require('body-parser');
const upload = require('express-fileupload');
app.use(upload());
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.set('view engine', 'ejs');
app.set('views', './views');
app.use( express.static( "uploads" ) );
app.use(cors());
app.use(express.json())

const options = {
    uri: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&recognitionModel=recognition_04&returnRecognitionModel=false&detectionModel=detection_03&faceIdTimeToLive=86400',
    verifyUri: 'https://eastus.api.cognitive.microsoft.com/face/v1.0/verify',
    headers : {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '31024abd20e841c1b747ed349eebf23c'
    }
};
app.get('/', (req, res) => {
    res.send('Hello tout le monde')
});
const faceIds = {
    faceId1:'' ,
    faveId2:''
};
axios.post(options.uri, { url : 'https://detect-project.herokuapp.com/hliwa/1.jpg'},{headers: options.headers}).then((result) => {
        faceIds.faceId1 = result.data[0].faceId;
});
app.post('/upload', async (req, res) => {
    if(req.files) {
        file = req.files.file;
        filename = file.name;
        const hostname = req.protocol + '://' + req.get('host');
        file.mv('./uploads/' + filename, (err) => {
            if (err) {
                res.send(err);
            }else{
                axios.post(options.uri, { url : hostname + '/' + filename},{headers: options.headers}).then((result) => {
                      faceIds.faceId2 = result.data[0].faceId;
                      axios.post(options.uri, {
                        faceId: faceIds.faceId1,
                        personId: faceIds.faceId2,
                        largePersonGroupId: "sample_group"
                      },{headers: options.headers}).then((result) => {
                          res.send(resuult.data)
                      }).catch((err)=> {
                          console.log(err);
                      });
                });
            }
        })
    }
});



app.listen(process.env.PORT || 5000, () => {
    console.log('lesten port 5000');
})