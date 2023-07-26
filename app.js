const express = require('express');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const dotenv = require('dotenv');
const path = require('path');
const soap = require('soap');
const fs = require('fs');

dotenv.config();
const url = path.join('./config/wsdl', process.env.CALC_WSDL);

const app = express();

app.engine('hbs', expressHbs.engine({
    layoutsDir: 'templates\\layouts',
    defaultLayout: 'layout',
    extname: 'hbs'
}));

app.set('view engine', 'hbs');
app.set('views', 'templates');
//настройка функционала частичных представлений
hbs.registerPartials('templates\\partials');

// for bootstrap css
app.use('/css', express.static(__dirname + '/css'));
app.use(express.json());

app.get('/', function(req, res){
    res.render('home.hbs');
});

app.post('/', (req, res) => {

    soap.createClient(url, (err, client) => {
        if (err) {
            console.error(err);
            res.send(err.message);
        }

        const args = { intA: req.body.inA, intB: req.body.inB };
        client.Add(args, function(err, result) {
            if (err) {
                console.error(err);
                res.send(err.message);
            } else {
                console.log(result);
                res.send(result);
            }
        });
    });
})



app.get('/describe', (req, res) => {
    soap.createClient(url, (err, client) => {
        if (err) {
            console.error(err);
        }

        res.json(client.describe());
    });
})


app.listen(3000, () => {
    console.log('Server started at 3000 port');
});

