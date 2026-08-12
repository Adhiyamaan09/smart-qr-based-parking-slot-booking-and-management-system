import express from 'express';
import con from "../utils/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Define secret key

router.post("/adminlogin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ Status: false, Error: "All fields are required" });
  }

  const sql = "SELECT * FROM admin WHERE email = ?";
  con.query(sql, [email], (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error: " + err });

    if (result.length === 0) {
      return res.json({ Status: false, Error: "Invalid Email or Password" });
    }

    const admin = result[0];

    // **Simple Password Check (No Hashing)**
    if (password !== admin.password) {
      return res.json({ Status: false, Error: "Invalid Email or Password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: admin.id, email: admin.email, role: "admin" }, secretKey, { expiresIn: "1h" });

    // Set cookie with JWT token
    res.cookie("admin_token", token, {
      httpOnly: true, // Prevents client-side access
      secure: process.env.NODE_ENV === "production", // Only HTTPS in production
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ Status: true, Message: "Admin Login Successful", Token: token });
  });
});

router.get('/bookings/:id', (req, res) => {
    const { id } = req.params;

    con.query(`SELECT * FROM bookings WHERE id = ?`, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ booking: results[0] });
    });
});

// Update parking status to "yes"
router.put('/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { parking_status } = req.body;

    const query = `UPDATE bookings SET parking_status = ? WHERE id = ?`;
    con.query(query, [parking_status, id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to update parking status' });

        res.json({ message: 'Parking status updated successfully' });
    });
});

router.put('/bookings/:id/checkout', (req, res) => {
    const bookingId = req.params.id;
    const sql = `UPDATE bookings SET parking_status = 'expired' WHERE id = ?`;

    con.query(sql, [bookingId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update parking status' });
        }
        res.json({ message: 'Parking checked out. Ticket expired.' });
    });
});

router.get("/parkinglogs", (req, res) => {
  const { id, place_name } = req.query;

  let query = `
      SELECT b.id, b.slot_id, 
             COALESCE(l.name, 'Unknown') AS location_name, 
             COALESCE(l.type, 'Unknown') AS location_type, 
             b.owner_name, b.owner_contact, b.car_number, 
             b.car_model, b.booking_time, b.hours, 
             b.total_cost, b.parking_status
      FROM bookings b
      LEFT JOIN slots s ON b.slot_id = s.id
      LEFT JOIN location l ON s.location_id = l.id
  `;

  let conditions = [];
  let values = [];

  if (id) {
      conditions.push("l.id = ?");
      values.push(id);
  }
  
  if (place_name) {
      conditions.push("LOWER(l.name) = LOWER(?)"); // Case-insensitive comparison
      values.push(place_name);
  }

  if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY b.booking_time DESC";

  con.query(query, values, (err, results) => {
      if (err) {
          console.error("Error fetching parking logs:", err);
          return res.status(500).json({ error: "Failed to fetch parking logs" });
      }

      if (results.length === 0) {
          return res.status(404).json({ message: "No parking logs found for the given criteria." });
      }

      res.json(results);
  });
});




export { router as adminRouter };
