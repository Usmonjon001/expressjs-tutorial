const express = require('express');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');

let cookieParser = require('cookie-parser');
require('./data')



// Routes
const uzbnews = require('./routes/uzbnews');
const auth = require('./routes/auth');

// Templates
const news = fs.readFileSync('../example.html', 'utf8');

const app = express();

// Middlewares
app.use(express.json());            
app.use(express.urlencoded(
    { extended: true }
));   
app.use(cookieParser())

app.use(cors())
app.use('/images', express.static('uploads'))

app.use(session({
    secret: 'ABSDCSDFSDFFSDFSF',
    resave: false,
    saveUninitialized: false
}))

// Routes
app.use('/api/v1/auth', auth)
app.use('/api/v1/uzbnews', uzbnews)

const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`The server is listening on ${PORT}`);
});
