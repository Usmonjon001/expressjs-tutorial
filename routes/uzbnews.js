const { Router } = require('express');
const fs = require('fs');
const multer = require('multer');

let router = Router()

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

// Postlarni Olish
router.get('/', 
    (req, res, next) => {
       const { whoami } = req.body;
       if(whoami == 'user'){
           console.log('Foydalanuvchi Ro\'yxatdan o\'tgan');
           return next();
       }
       return res.sendStatus(401)
    },
    (req, res) =>{
        console.log(req.cookies);

        const { whoami } = req.cookies;
        if(whoami == 'user'){
            return res.send(JSON.stringify(dataObject.uznews, null, 4))
        }

        res.cookie('whoami', 'user', { maxAge: 15000 })
        return res.send({
            msg: "Sizning Saytga Birinchi Marta kirishingiz!"
        })        
    }
)

// Malumotlarni Qidirish
router.get('/search', (req, res) => {
    let { title } = req.query;
    let filtereddata = dataObject.uznews.filter(el => el.title.toLowerCase().includes(title));
    res.send(JSON.stringify(filtereddata, null, 4))
})

// Postni Yangilash
router.put('/:id', upload.single('photo'), (req, res) =>{
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

// Yangi Post Yaratish
router.post('/', upload.single('photo'), (req, res) =>{
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

// Postni Ochirish
router.delete('/:id', (req, res) =>{
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


router.post('/test/', (req, res) => {
    const { title, text } = req.body;
    const carditem = { title, text };
    console.log(carditem);
    const { card } = req.session;
    if(card){
        req.session.card.push(carditem)
        return res.send(req.session.card)
    } else {
        req.session.card = [carditem];
    }
    console.log(req.sessionID);
    res.send(201);
})

module.exports = router;
