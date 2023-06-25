const { Router } = require('express');
const fs = require('fs');
const multer = require('multer');

let route = Router()

// Data
const data = fs.readFileSync('./data/db.json', 'utf-8');
let dataObject = JSON.parse(data)

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage})


route.get('/api/uzbnews', 
    (req, res, next) => {
       const { whoami } = req.body;
       if(whoami == 'user'){
           console.log('Foydalanuvchi Ro\'yxatdan o\'tgan');
           return next();
       }
       return res.sendStatus(401)
    },
    (req, res) =>{
        res.send(JSON.stringify(dataObject.uznews, null, 4))
    }
)


route.post('/api/uzbnews', upload.single('photo'), (req, res) =>{
    console.log(req.file);
    req.body.id = Math.floor(Math.random() * 10000000);
    req.body.date = Date();
    req.body.img_url = 'http://127.0.0.1:3000/images/'+req.file.filename;
    dataObject.uznews.push(req.body)
    let status = fs.writeFileSync('./data/db.json', JSON.stringify(dataObject, null, 4), (err, data) => err);
    if(status == undefined){
        res.send(201, {
            status: 'ok',
            msg: "Post Muafaqqiyatli qo'yildi"
        })
    }
})


route.delete('/api/uzbnews/:id', (req, res) =>{
    let { id } = req.params;
    dataObject.uznews = dataObject.uznews.filter(el => {
        
        
        // console.log(img[img.length - 1]);
        
        if(el.id == id) {
            let img = el.img_url.split('/')
            let removeImg = fs.unlinkSync(`./uploads/${img[img.length - 1]}`);
        }

        return el.id != id
    });
    
    let status = fs.writeFileSync('./data/db.json', JSON.stringify(dataObject, null, 4), (err, data) => err);
    if(status == undefined){
        res.status(200).json({
            status: 'ok',
            msg: "Post Muafaqqiyatli o'chirildi"
        })
    }
})

route.put('/api/uzbnews/:id', upload.single('photo'), (req, res) =>{
    let { id } = req.params;
    console.log(req.body, id);
    console.log(req.file.filename);
    let [dataupdator] = dataObject.uznews.filter(el => el.id == id);
    let img = dataupdator.img_url.split('/')
    let removeImg = fs.unlinkSync(`./uploads/${img[img.length - 1]}`);
    dataupdator = {...req.body}
    dataupdator.id = id
    dataupdator.img_url = 'http://127.0.0.1:3000/images/'+req.file.filename;
    console.log(dataupdator);
    let newdata = dataObject.uznews.map(el => {
        if(el.id == id){
            el = dataupdator
          }
          return el
    })

    console.log(newdata);

    dataObject.uznews = newdata;

    let status = fs.writeFileSync('./data/db.json', JSON.stringify(dataObject, null, 4), (err, data) => err);
    res.status(200).json({
        status: 'ok',
        msg: "Element Muoffaqqiyatli Yangilandi!"
    })
    // console.log(dataObject.uznews);
})


module.exports = route;