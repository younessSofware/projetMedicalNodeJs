const express  = require('express');














const app = express();
const cors = require('cors');
const upload = require('express-fileupload');
const cookie = require('cookie-parser');
require('dotenv').config();
app.use(upload());
app.set('view engine', 'ejs');
app.set('views', './views');
//import Routes
const userRouter = require('./Routes/users')
const maladeRouter = require('./Routes/malade');
const patientRouter = require('./Routes/patient');
const consultationRouter = require('./Routes/consultations');
const messageRouter = require('./Routes/message');
const infermerieRouter = require('./Routes/infermerie');
app.use( express.static( "uploads" ) );
app.use(cors());
app.use(express.json())
const mongoose = require("mongoose");
app.use(cookie());
app.use('/', (req, res) => {
    res.send('hello');
})
app.use('/api/users', userRouter);
app.use('/api/malades', maladeRouter);
app.use('/api/patients', patientRouter);
app.use('/api/consultations', consultationRouter);
app.use('/api/messages', messageRouter);
app.use('/api/infermeris', infermerieRouter);


console.log('******************')
console.log(process.env.ATLAS)
console.log('******************')

mongoose.connect(process.env.ATLAS)
        .then((res) => {
            console.log("connection success");
        })
        .catch((err) => {
            console.log(err);
        });

app.listen(process.env.PORT || 5000, () => {
    console.log('lesten port 5000');
})
