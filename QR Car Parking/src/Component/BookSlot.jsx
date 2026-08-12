import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookSlot = () => {
    const { location_id } = useParams();
    const navigate = useNavigate();

    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [ownerName, setOwnerName] = useState("");
    const [ownerContact, setOwnerContact] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [carModel, setCarModel] = useState("");
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [hours, setHours] = useState(1);
    const [parkingCostPerHour, setParkingCostPerHour] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("info");
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setTotalCost(hours * parkingCostPerHour);
    }, [hours, parkingCostPerHour]);

    useEffect(() => {
        if (!bookingDate || !bookingTime || hours < 1) return;

        const formattedBookingTime = `${bookingDate} ${bookingTime}:00`;

        axios.get(`http://localhost:3006/auth/slots/${location_id}`, {
            params: { booking_time: formattedBookingTime, hours }
        })
        .then(response => {
            if (!response.data.slots || response.data.slots.length === 0) {
                setMessage("No slots available for the selected time.");
                setMessageType("error");
                setShowPopup(true);
            } else {
                setMessage("");
            }
            setSlots(response.data.slots || []);
            setParkingCostPerHour(response.data.parkingCostPerHour || 0);
        })
        .catch(error => {
            setMessage(error.response?.data?.error || "Error fetching slots.");
            setMessageType("error");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        });
    }, [location_id, bookingDate, bookingTime, hours]);

    const handleBooking = (e) => {
        e.preventDefault();

        if (!selectedSlot || !ownerName || !ownerContact || !carNumber || !carModel || !bookingDate || !bookingTime || hours <= 0) {
            setMessage("Please fill in all details.");
            setMessageType("error");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }

        const formattedBookingTime = `${bookingDate} ${bookingTime}:00`;

        axios.post("http://localhost:3006/auth/slots/book", {
            slot_id: selectedSlot,
            owner_name: ownerName,
            owner_contact: ownerContact,
            car_number: carNumber,
            car_model: carModel,
            booking_time: formattedBookingTime,
            hours: hours
        })
        .then(response => {
            if (response.data.Status) {
                setMessage(`Slot booked successfully! Total Cost: ₹${response.data.totalCost}`);
                setMessageType("success");
                setShowPopup(true);
                resetForm();
                setTimeout(() => {
                    setShowPopup(false);
                    navigate("/dashboard");
                }, 3000);
            } else {
                setMessage(response.data.message);
                setMessageType("error");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
            }
        })
        .catch(error => {
            setMessage(error.response?.data?.error || "Error booking slot.");
            setMessageType("error");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
        });
    };

    const resetForm = () => {
        setSelectedSlot(null);
        setOwnerName("");
        setOwnerContact("");
        setCarNumber("");
        setCarModel("");
        setBookingDate("");
        setBookingTime("");
        setHours(1);
    };

    return (
        <div className="booking-wrapper">
            {showPopup && (
                <div className="popup-overlay">
                    <div className={`popup-message shadow-lg ${messageType}`}>
                        <h5>{message}</h5>
                        {messageType === "success" && <p>Redirecting to dashboard...</p>}
                    </div>
                </div>
            )}

            <div className="card booking-card shadow-lg p-4">
                <h3 className="text-center mb-4">Book a Parking Slot</h3>
                <form onSubmit={handleBooking}>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Owner Name</label>
                            <input type="text" className="form-control" value={ownerName} onChange={e => setOwnerName(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Owner Contact</label>
                            <input type="text" className="form-control" value={ownerContact} onChange={e => setOwnerContact(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Car Number</label>
                            <input type="text" className="form-control" value={carNumber} onChange={e => setCarNumber(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Car Model</label>
                            <input type="text" className="form-control" value={carModel} onChange={e => setCarModel(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Booking Date</label>
                            <input type="date" className="form-control" value={bookingDate} onChange={e => setBookingDate(e.target.value)} required />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Booking Time</label>
                            <input type="time" className="form-control" value={bookingTime} onChange={e => setBookingTime(e.target.value)} required />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label">Number of Hours</label>
                            <input type="number" className="form-control" value={hours} min="1" onChange={e => setHours(parseInt(e.target.value) || 1)} required />
                        </div>
                    </div>

                    <h5 className="text-center mt-4">Select a Slot</h5>
                    <div className="d-flex flex-wrap justify-content-center mb-3">
                        {slots.length > 0 ? (
                            slots.map(slot => (
                                <div
                                    key={slot.id}
                                    className={`slot-box ${slot.status === "booked" ? "booked" : selectedSlot === slot.id ? "selected" : ""}`}
                                    onClick={() => {
                                        if (slot.status !== "booked") setSelectedSlot(slot.id);
                                    }}
                                    title={slot.status === "booked" ? "Slot already booked" : "Click to select"}
                                >
                                    {slot.slot_number}
                                </div>
                            ))
                        ) : (
                            <h6 className="text-center text-danger">No slots available for this time.</h6>
                        )}
                    </div>

                    <div className="text-center">
                        <button className="btn btn-success px-4 py-2" type="submit" disabled={!selectedSlot || slots.length === 0}>
                            Confirm Booking
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .booking-wrapper {
                    background-color: #f1f5f9;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 10px;
                }
                .booking-card {
                    background: white;
                    border-radius: 16px;
                    max-width: 700px;
                    width: 100%;
                }
                .slot-box {
                    width: 60px;
                    height: 60px;
                    margin: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #0d6efd;
                    border-radius: 8px;
                    font-weight: bold;
                    background-color: #e9ecef;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                }
                .slot-box:hover {
                    background-color: #0d6efd;
                    color: #fff;
                }
                .selected {
                    background-color: #198754;
                    color: white;
                    border-color: #198754;
                }
                .booked {
    background-color: #f8d7da; 
    color: #842029;          
    border-color: #f5c2c7;     
    cursor: not-allowed;
    pointer-events: none;
}
                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1050;
                }
                .popup-message {
                    background: white;
                    padding: 30px 40px;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    font-size: 16px;
                }
                .popup-message.success {
                    color: #198754;
                    border-left: 6px solid #198754;
                }
                .popup-message.error {
                    color: #dc3545;
                    border-left: 6px solid #dc3545;
                }
                .popup-message.info {
                    color: #0d6efd;
                    border-left: 6px solid #0d6efd;
                }
            `}</style>
        </div>
    );
};

export default BookSlot;
