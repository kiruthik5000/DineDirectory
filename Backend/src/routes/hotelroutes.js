const express = require('express');
const router = express.Router();
const {getall, getByTheme, getById} = require('../controller/hotelcontroller')


router.get('/', getall)
router.get('/:id', getById)
module.exports = router