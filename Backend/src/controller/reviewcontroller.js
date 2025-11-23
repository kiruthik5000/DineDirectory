// @ts-nocheck
const review = require("../models/review")

const getall = async (req, res) => {
  try {
    const reviews = await review.find()
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getByHotelId = async (req, res) => {
  try {
    const reviews = await review.find({ hotelId: req.params.hotelId })
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createReview = async (req, res) => {
  try {
    const newReview = await review.create(req.body)
    res.status(201).json(newReview)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = {
  getall,
  getByHotelId,
  createReview
}

