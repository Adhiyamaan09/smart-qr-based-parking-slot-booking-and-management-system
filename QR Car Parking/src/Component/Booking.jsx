import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState("");
    const ticketRef = useRef(null);

    useEffect(() => {
        if (!id) {
            setError("Booking ID is missing");
            return;
        }

        axios
            .get(`http://localhost:3006/auth/bookings/${id}`)
            .then((response) => {
                setBooking(response.data.booking);
            })
            .catch(() => {
                setError("Booking not found");
            });
    }, [id]);

    // Function to download ticket as an image (PNG)
    const downloadTicketAsImage = () => {
        if (!ticketRef.current) return;

        html2canvas(ticketRef.current, { scale: 3 }).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `Booking_Ticket_${id}.png`;
            link.click();
        });
    };

    // Function to cancel booking
    const cancelBooking = () => {
        if (!booking) return;

        axios
            .delete(`http://localhost:3006/auth/bookings/${id}`)
            .then(() => {
                return axios.put(`http://localhost:3006/auth/slots/${booking.slot_id}`, { is_booked: 0 });
            })
            .then(() => {
                alert("Booking cancelled successfully!");
                navigate("/dashboard/bookings");
            })
            .catch(() => {
                alert("Failed to cancel booking.");
            });
    };

    if (error) return <h2>{error}</h2>;
    if (!booking) return <h2>Loading...</h2>;

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#f4f4f4", padding: "20px" }}>
            <h1 style={{ color: "#2a2a2a", fontSize: "28px", fontWeight: "bold" }}>Parking Ticket</h1>
            <div
                ref={ticketRef}
                style={{
                    padding: "25px", // Adjusted padding for better layout
                    border: "5px dashed #2C2D2D", // Dashed border for a more "ticket-like" appearance
                    borderRadius: "10px", // Rounded corners for a softer look
                    display: "flex",
                    backgroundColor: "#fff",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Deeper shadow for more depth
                    justifyContent: "space-between",
                    width: "50%", // Reduced width for a more compact ticket
                    margin: "0 auto",
                    fontSize: "16px",
                    color: "#333",
                    fontWeight: "normal", // Normal weight for better readability
                    flexDirection: "row",
                    paddingBottom: "20px",
                }}
            >
                <div style={{ width: "60%", paddingRight: "10px", textAlign: "left" }}> {/* Reduced padding-right */}
                    <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#0d6efd", textAlign: "center" }}>Booking Details</h2>
                    <p><strong>Owner:</strong> {booking.owner_name}</p>
                    <p><strong>Contact:</strong> {booking.owner_contact}</p>
                    <p><strong>Car Number:</strong> {booking.car_number}</p>
                    <p><strong>Car Model:</strong> {booking.car_model}</p>
                    <p><strong>Slot ID:</strong> {booking.slot_id}</p>
                    <p><strong>Booking Time:</strong> {new Date(booking.booking_time).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {booking.hours} hours</p>
                    <p><strong>Total Cost:</strong> ₹{booking.total_cost}</p>
                </div>

                {/* QR Code */}
                <div style={{ width: "30%", textAlign: "center", paddingLeft: "10px", display: "flex", flexDirection: "column", justifyContent: "center" }}> {/* Reduced padding-left */}
                    <QRCodeCanvas value={`http://localhost:5173/dashboard/booking/${id}`} size={140} />
                </div>
            </div>

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={downloadTicketAsImage}
                    style={{
                        padding: "12px 30px",
                        fontSize: "18px",
                        background: "#0d6efd",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginTop: "20px",
                    }}
                >
                    Download Ticket
                </button>

                <button
                    onClick={cancelBooking}
                    style={{
                        padding: "12px 30px",
                        fontSize: "18px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "5px",
                        marginLeft: "15px",
                        marginTop: "20px",
                    }}
                >
                    Cancel Booking
                </button>
            </div>
        </div>
    );
};

export default Booking; 