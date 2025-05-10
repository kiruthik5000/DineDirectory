const express = require('express');
const router = express.Router();
const {getall, getbyName, addUser, userlogin} = require('../controller/usercontroller');
router.get('/getall', getall)
router.get('/getbyname', getbyName)
router.post('/adduser', addUser)
router.post('/login', userlogin)
module.exports = router