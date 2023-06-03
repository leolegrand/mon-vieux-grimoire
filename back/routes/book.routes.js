const express = require('express')
const router = express.Router()

const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const bookCtrl = require('../controllers/book.controller')

router.get('/', bookCtrl.getAllBooks)
router.get('/bestrating', bookCtrl.getTopRatedBooks)
router.get('/:id',  bookCtrl.getOneBook)
router.post('/', auth, multer, bookCtrl.createBook)
router.post('/:id/rating', auth, bookCtrl.addBookRating)
router.put('/:id',  bookCtrl.modifyBook)
router.delete('/:id',  bookCtrl.deleteBook)

module.exports = router