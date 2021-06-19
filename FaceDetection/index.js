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
                      axios.post(options.verifyUri, {
                        faceId1: faceIds.faceId1,
                        faceId2: faceIds.faceId2,
                      },{headers: options.headers}).then((result) => {
                          res.send(result.data)
                      }).catch((err)=> {
                          console.log('************************')
                          res.send(faceIds)
                          console.log('***************************')
                      });
                });
            }
        })
    }
});