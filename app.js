const express  = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send("Hello my friend")
})
app.listen(5000, () => {
    console.log('lesten port 5000');
})