const express = require('express');
const fs = require('fs');
const cors = require('cors');


// Routes
const uzbnews = require('./routes/uzbnews')
// GET
// ------ req ------ Security Midleware ----- ||  <-=---- res DATA; 


// Templates
const news = fs.readFileSync('../example.html', 'utf8');

const app = express();

// Middlewares
app.use(express.json());            
app.use(express.urlencoded(
    { extended: true }
));   

app.use(cors())
app.use('/images', express.static('uploads'))

// Routes
app.use(uzbnews)

const PORT = 3000;

app.listen(PORT, () =>{
    console.log(`The server is listening on ${PORT}`);
})

app.get('/', (req, res) =>{
    res.send(news)
})
