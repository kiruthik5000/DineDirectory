const Booking = require('../models/bookings');

exports.createBooking = async (req, res) => {
    try {
        const { hotelId, customerName, customerPhone, date, time, numberOfGuests } = req.body;
        
        const newBooking = new Booking({
            hotelId: hotelId,
            customerName,
            customerPhone,
            date,
            time,
            numberOfGuests
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        console.error("Error creating booking:", err);
        res.status(500).json({ error: "Failed to create booking" });
    }
};

exports.getBookingsByHotel = async (req, res) => {
    try {
        const bookings = await Booking.find({ hotelId: req.params.hotelId });
        res.status(200).json(bookings);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch bookings" });
    }
};
