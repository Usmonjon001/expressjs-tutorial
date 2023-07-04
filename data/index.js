const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/expressjs_tutorial')
    .then(() => console.log('Connected To DB'))
    .catch(err => console.error(err))