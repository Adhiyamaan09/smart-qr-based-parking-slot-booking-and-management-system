// middlewares/validateBooking.js

const validateBooking = (req, res, next) => {
    const {
        slot_id,
        owner_name,
        owner_contact,
        car_number,
        car_model,
        booking_time,
        hours
    } = req.body;

    if (!slot_id || !owner_name || !owner_contact || !car_number || !car_model || !booking_time || !hours) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Validate phone number
    if (!/^\d{10}$/.test(owner_contact)) {
        return res.status(400).json({ error: "Owner contact must be exactly 10 digits." });
    }

    // Validate car number format (simple pattern, can be updated as per regional rules)
    if (!/^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{4}$/.test(car_number.toUpperCase())) {
        return res.status(400).json({ error: "Invalid car number format. Example: TN 12 AB 1234" });
    }
    

    // Validate booking_time is a valid future date
    const bookingDateTime = new Date(booking_time);
    if (isNaN(bookingDateTime.getTime()) || bookingDateTime < new Date()) {
        return res.status(400).json({ error: "Booking time must be a valid future date/time." });
    }

    // Validate hours
    const parsedHours = parseInt(hours);
    if (isNaN(parsedHours) || parsedHours < 1) {
        return res.status(400).json({ error: "Booking duration must be at least 1 hour." });
    }

    next(); // All checks passed
};

export default validateBooking;
