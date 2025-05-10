const Hotel = require('../models/hotels');

// services 

const getall = async (req, res) => {
    try{
        const type = req.query.type
        let hotels;
        if(type){
            hotels = await Hotel.find({theme:type})
        }else{
            hotels = await Hotel.find();
        }
        // console.log(hotels);
        res.status(200).json(hotels);
    }catch(err) {
        res.status(500).json({message:err.message})
    }
}

const getByTheme = async (req, res) => {
    try{
        const type = req.query.type
        const hotels = await Hotel.find({theme:type})
        res.status(200).json(hotels);
    }catch(err){
        res.status(500).json({message:err.message})
    }
}

const getById = async (req, res) => {
    try{
        const cur_id = req.params.id
        const hotel = await Hotel.findOne({id:cur_id})
        res.status(200).json(hotel)
    }catch(err){
        res.status(500).json({message:err.message})
    }
}
module.exports = {getall, getByTheme, getById}