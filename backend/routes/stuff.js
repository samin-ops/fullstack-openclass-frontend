
const express = require('express')
const stuffCtrl = require('../controllers/stuff')
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')
const router = express.Router()

router.post('/', auth, multer, stuffCtrl.createThing )
router.put('/:id', auth, multer, stuffCtrl.modifiedThing)
router.delete('/:id', auth, stuffCtrl.deleteThing )
router.get('/:id', auth, stuffCtrl.getOnThingById ) 
router.get('/', auth,  stuffCtrl.GetAllThings) 

module.exports = router;