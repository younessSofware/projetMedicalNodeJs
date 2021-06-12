const express  = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');
app.use( express.static( "uploads" ) );

app.get('/', (req, res) => {
    res.render('index', {})
});
app.listen(process.env.PORT || 5000, () => {
    console.log('lesten port 5000');
})