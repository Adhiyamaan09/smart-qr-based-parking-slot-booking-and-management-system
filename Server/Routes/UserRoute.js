import express from "express";
import con from "../utils/db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validateBooking from "../middlewares/validateBooking.js"; 

const router = express.Router();


router.post("/userlogin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ Status: false, Error: "All fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  con.query(sql, [email], async (err, result) => {
    if (err) return res.json({ Status: false, Error: "Database Error: " + err });

    if (result.length === 0) {
      return res.json({ Status: false, Error: "Invalid Email or Password" });
    }

    const user = result[0];

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({ Status: false, Error: "Invalid Email or Password" });
    }

    // Ensure `imp_key` is defined
    const secretKey = process.env.JWT_SECRET || "default_secret_key";

    // Generate JWT Token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: "1h" });

    // Set cookie with JWT token
    res.cookie("token", token, {
      httpOnly: true,   // Prevents client-side access
      secure: process.env.NODE_ENV === "production",  // Only HTTPS in production
      sameSite: "Strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({ Status: true, Message: "Login Successful", Token: token });
  });
});


router.post("/register", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // Check if any field is empty
  if (!email || !password || !confirmPassword) {
    return res.json({ Status: false, Error: "All fields are required" });
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    return res.json({ Status: false, Error: "Passwords do not match" });
  }

  try {
    // Hash password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    con.query(sql, [email, hashedPassword], (err, result) => {
      if (err) return res.json({ Status: false, Error: "Database Error: " + err });
      return res.json({ Status: true, Message: "User registered successfully!" });
    });
  } catch (error) {
    return res.json({ Status: false, Error: "Server Error: " + error.message });
  }
});

router.get("/dashboard", (req, res) => {
  const sql = `
      SELECT 
          (SELECT COUNT(*) FROM location WHERE type = 'hotel') AS hotels,
          (SELECT COUNT(*) FROM location WHERE type = 'theater') AS theaters,
          (SELECT COUNT(*) FROM location WHERE type = 'mall') AS malls
  `;

  con.query(sql, (err, result) => {
      if (err) {
          return res.json({ Status: false, Error: "Database Error: " + err });
      }
      res.json({ Status: true, counts: result[0] }); // Ensure response format matches frontend
  });
});

router.get('/hotels', (req, res) => {
  const query = "SELECT * FROM location WHERE type = 'hotel'";
  con.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ Status: false, error: err.message });
      }
      res.json({ Status: true, hotels: results });
  });
});

router.get('/theaters', (req, res) => {
  const query = "SELECT * FROM location WHERE type = 'theater'";
  con.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ Status: false, error: err.message });
      }
      res.json({ Status: true, theaters: results });
  });
});

router.get('/malls', (req, res) => {
  const query = "SELECT * FROM location WHERE type = 'mall'";
  con.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ Status: false, error: err.message });
      }
      res.json({ Status: true, malls: results });
  });
});

router.get("/costs", (req, res) => {
  const sql = "SELECT type,cost_per_hour FROM parking_rates";
  
  con.query(sql, (err, results) => {
      if (err) {
          return res.json({ Status: false, Error: "Query Error: " + err });
      }

      if (results.length === 0) {
          return res.json({ Status: false, Error: "No parking cost data found" });
      }

      // Assuming you have three specific locations in the database
      let costs = {
          hotel: 0,
          theater: 0,
          mall: 0
      };

      results.forEach((row) => {
          if (row.type === "hotel") {
              costs.hotel = row.cost_per_hour;
          } else if (row.type === "theater") {
              costs.theater = row.cost_per_hour;
          } else if (row.type === "mall") {
              costs.mall = row.cost_per_hour;
          }
      });

      return res.json({ Status: true, costs });
  });
});

router.get("/slots/:location_id", (req, res) => {
    const { location_id } = req.params;
    const { booking_time, hours } = req.query;

    if (!booking_time || !hours) {
        return res.status(400).json({ error: "Booking time and hours are required" });
    }

    const requestedTime = new Date(booking_time);
    const requestedEndTime = new Date(requestedTime);
    requestedEndTime.setHours(requestedEndTime.getHours() + parseInt(hours));

    const now = new Date();
    if (requestedTime < now) {
        return res.status(400).json({ error: "Cannot select a past date for booking" });
    }

    const costQuery = "SELECT cost_per_hour FROM location WHERE id = ?";
    con.query(costQuery, [location_id], (err, costResult) => {
        if (err) return res.status(500).json({ error: "Error fetching cost" });
        if (costResult.length === 0) return res.status(404).json({ error: "Location not found" });

        const parkingCostPerHour = costResult[0].cost_per_hour;

        // Step 1: Get all slots for this location
        const allSlotsQuery = "SELECT id, slot_number FROM slots WHERE location_id = ?";
        con.query(allSlotsQuery, [location_id], (err1, allSlots) => {
            if (err1) return res.status(500).json({ error: "Error fetching all slots" });

            // Step 2: Get overlapping bookings
            const bookedSlotsQuery = `
                SELECT slot_id FROM bookings 
                WHERE (
                    (? < DATE_ADD(booking_time, INTERVAL hours HOUR)) AND (? >= booking_time)
                ) 
                OR (
                    (? <= DATE_ADD(booking_time, INTERVAL hours HOUR)) AND (? > booking_time)
                )
            `;
            con.query(bookedSlotsQuery, [
                requestedTime, requestedEndTime,
                requestedTime, requestedEndTime
            ], (err2, bookedSlotResults) => {
                if (err2) return res.status(500).json({ error: "Error fetching booked slots" });

                const bookedSlotIds = bookedSlotResults.map(b => b.slot_id);

                // Step 3: Merge results and add status
                const slotsWithStatus = allSlots.map(slot => ({
                    id: slot.id,
                    slot_number: slot.slot_number,
                    status: bookedSlotIds.includes(slot.id) ? "booked" : "available"
                }));

                res.json({
                    slots: slotsWithStatus,
                    parkingCostPerHour
                });
            });
        });
    });
});





// ✅ FIXED BOOKING LOGIC
router.post("/slots/book", validateBooking, (req, res) => {
    const { slot_id, owner_name, owner_contact, car_number, car_model, booking_time, hours } = req.body;

    if (!slot_id || !owner_name || !owner_contact || !car_number || !car_model || !booking_time || !hours) {
        return res.status(400).json({ Status: false, message: "All fields are required" });
    }

    const now = new Date();
    const requestedTime = new Date(booking_time);
    const requestedEndTime = new Date(requestedTime);
    requestedEndTime.setHours(requestedEndTime.getHours() + parseInt(hours));

    if (requestedTime < now) {
        return res.status(400).json({ Status: false, message: "Cannot book a slot for a past date" });
    }

    const checkAvailability = `
        SELECT EXISTS(
            SELECT 1 FROM bookings 
            WHERE slot_id = ? 
            AND (
                (? BETWEEN booking_time AND DATE_ADD(booking_time, INTERVAL hours HOUR)) 
                OR 
                (? BETWEEN booking_time AND DATE_ADD(booking_time, INTERVAL hours HOUR))
                OR
                (booking_time BETWEEN ? AND ?)
            )
        ) AS slot_taken
    `;

    con.query(checkAvailability, [
        slot_id, 
        requestedTime, requestedEndTime, 
        requestedTime, requestedEndTime
    ], (err, result) => {
        if (err) {
            return res.status(500).json({ Status: false, message: "Database error", error: err });
        }

        if (result[0].slot_taken) {
            return res.json({ Status: false, message: "Slot is already booked for this time" });
        }

        const costQuery = `
            SELECT pr.cost_per_hour 
            FROM parking_rates pr
            JOIN location l ON pr.type = l.type
            JOIN slots s ON l.id = s.location_id
            WHERE s.id = ?
        `;

        con.query(costQuery, [slot_id], (err, costResult) => {
            if (err || costResult.length === 0) {
                return res.status(500).json({ Status: false, message: "Error fetching parking rate", error: err });
            }

            const parkingCostPerHour = costResult[0].cost_per_hour;
            const totalCost = parkingCostPerHour * hours;

            con.beginTransaction(err => {
                if (err) {
                    return res.status(500).json({ Status: false, message: "Transaction error", error: err });
                }

                const insertQuery = `
                    INSERT INTO bookings 
                    (slot_id, owner_name, owner_contact, car_number, car_model, booking_time, hours, total_cost) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;

                con.query(insertQuery, [slot_id, owner_name, owner_contact, car_number, car_model, booking_time, hours, totalCost], (err) => {
                    if (err) {
                        return con.rollback(() => {
                            res.status(500).json({ Status: false, message: "Error inserting booking", error: err });
                        });
                    }

                    const updateQuery = `
                        UPDATE slots 
                        SET available_at = DATE_ADD(?, INTERVAL ? HOUR) 
                        WHERE id = ?
                    `;

                    con.query(updateQuery, [booking_time, hours, slot_id], (err) => {
                        if (err) {
                            return con.rollback(() => {
                                res.status(500).json({ Status: false, message: "Error updating slot status", error: err });
                            });
                        }

                        con.commit(err => {
                            if (err) {
                                return res.status(500).json({ Status: false, message: "Transaction commit failed", error: err });
                            }
                            res.json({ Status: true, message: "Slot booked successfully", totalCost });
                        });
                    });
                });
            });
        });
    });
});



router.get('/bookings', (req, res) => {
    const currentTime = new Date(); // Get the current time

    const sql = `
        SELECT * FROM bookings 
        WHERE DATE_ADD(booking_time, INTERVAL hours HOUR) > ?
    `;

    con.query(sql, [currentTime], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "No active bookings found" });
        }
        res.json({ bookings: results });
    });
});

router.get('/bookings/:id', (req, res) => {
    const { id } = req.params;
    const currentTime = new Date(); // Get the current time

    const sql = `
        SELECT * FROM bookings 
        WHERE id = ? 
        AND DATE_ADD(booking_time, INTERVAL hours HOUR) > ?
    `;

    con.query(sql, [id, currentTime], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Booking not found or expired" });
        }
        res.json({ booking: results[0] });
    });
});


router.delete('/bookings/:id', (req, res) => {
  const { id } = req.params;

  con.query('DELETE FROM bookings WHERE id = ?', [id], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error deleting booking' });
      }
      res.json({ message: 'Booking deleted successfully' });
  });
});

router.put('/slots/:id', (req, res) => {
  const { id } = req.params;
  const { is_booked } = req.body;

  con.query('UPDATE slots SET is_booked = ? WHERE id = ?', [is_booked, id], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'Error updating slot' });
      }
      res.json({ message: 'Slot updated successfully' });
  });
});



router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true, Message: "Logged out successfully" });
});


  export { router as userRouter }; 