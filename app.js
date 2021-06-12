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
    headers : {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '31024abd20e841c1b747ed349eebf23c'
    }
};
app.post('/upload', (req, res) => {
    if(req.files) {
        file = req.files.file;
        filename = file.name;
        const hostname = req.get('host');
        file.mv('./uploads/' + filename, (err) => {
            if (err) {
                res.send(err);
            }else{
                console.log(hostname + "/" + filename)
                axios.post(options.uri, { url : hostname + "/" + filename}
                    ,{
                        headers: options.headers     
                     }
                ).then((result) => {
                    res.send(result);
                }).catch((err) => {
                    res.send(err);
                    console.log(err.response.data.error);
                });
                res.send('file upload');
            }
        })
    }
});



app.listen(process.env.PORT || 5000, () => {
    console.log('lesten port 5000');
})