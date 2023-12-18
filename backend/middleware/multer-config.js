const multer = require('multer')

const MIME_TYPES ={
    'image/jpg':'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

const storage = multer.diskStorage({
    destination: (_req, _file, calback)=>{
        calback(null, "images")
    },
    filename: (_req, file, calback) =>{
        const name = file.originalname.split(' ').join('_') // enlever les espaces au nom du fichier et mettre underscore.
        const extension = MIME_TYPES[file.mimetype]
        calback(null, name + Date.now() + '.' + extension)
    }
})

module.exports = multer({storage}).single('image')