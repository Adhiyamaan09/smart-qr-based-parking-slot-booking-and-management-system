import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { FaQrcode } from "react-icons/fa";

const ScanQR = () => {
    const [booking, setBooking] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");
    const [scannerActive, setScannerActive] = useState(false);
    const [entryWindow, setEntryWindow] = useState("");  // to store entry window time
    const navigate = useNavigate();

    useEffect(() => {
        if (scannerActive) {
            const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

            scanner.render(
                (decodedText) => {
                    const bookingId = decodedText.split("/").pop();
                    fetchBookingDetails(bookingId);
                    scanner.clear();
                    setScannerActive(false);
                },
                (error) => {
                    console.error(error);
                }
            );

            return () => scanner.clear();
        }
    }, [scannerActive]);

    useEffect(() => {
        if (!booking) return;

        const bookingTime = new Date(booking.booking_time);
        const entryStart = new Date(bookingTime.getTime() - 20 * 60000); // 20 minutes before booking time
        const entryEnd = new Date(bookingTime.getTime() + 20 * 60000); // 20 minutes after booking time

        // Format the entry time window into a readable format
        const entryStartStr = entryStart.toLocaleString([], { 
            hour: "2-digit", 
            minute: "2-digit", 
            weekday: "short", 
            month: "short", 
            day: "numeric" 
        });
        const entryEndStr = entryEnd.toLocaleString([], { 
            hour: "2-digit", 
            minute: "2-digit", 
            weekday: "short", 
            month: "short", 
            day: "numeric" 
        });

        setEntryWindow(`Entry permitted between ${entryStartStr} and ${entryEndStr}`);
    }, [booking]);

    const fetchBookingDetails = (id) => {
        axios.get(`http://localhost:3006/auth/bookings/${id}`)
            .then((response) => {
                setBooking(response.data.booking);
                setStatus(response.data.booking.parking_status);
                setError("");
            })
            .catch(() => {
                setError("Booking not found");
                setBooking(null);
            });
    };

    const confirmParking = () => {
        if (!booking) return;

        if (vehicleNumber !== booking.car_number) {
            alert("Vehicle number does not match!");
            return;
        }

        const bookingTime = new Date(booking.booking_time);
        const currentTime = new Date();
        const duration = booking.duration_minutes || 60; // fallback
        const entryStart = new Date(bookingTime.getTime() - 20 * 60000);
        const entryEnd = new Date(bookingTime.getTime() + 20 * 60000);
        const bookingEnd = new Date(bookingTime.getTime() + duration * 60000);

        if (status === "expired") {
            alert("This ticket is already used. Cannot scan again.");
            return;
        }

        if (status === "yes") {
            if (currentTime > bookingEnd) {
                alert("Check-out time has expired. Ticket cannot be reused.");
                return;
            }

            axios.put(`http://localhost:3006/admin/bookings/${booking.id}/checkout`)
                .then(() => {
                    alert("Parking checked out. Ticket expired.");
                    setStatus("expired");
                    navigate("/admin/dashboard");
                })
                .catch(() => {
                    alert("Failed to update parking status.");
                });
        } else {
            if (currentTime < entryStart || currentTime > entryEnd) {
                const startStr = entryStart.toLocaleString([], { 
                    hour: "2-digit", 
                    minute: "2-digit", 
                    weekday: "short", 
                    month: "short", 
                    day: "numeric" 
                });
                const endStr = entryEnd.toLocaleString([], { 
                    hour: "2-digit", 
                    minute: "2-digit", 
                    weekday: "short", 
                    month: "short", 
                    day: "numeric" 
                });

                alert(`Check-in not allowed now. Please check in between ${startStr} and ${endStr}.`);
                return;
            }

            axios.put(`http://localhost:3006/admin/bookings/${booking.id}`, { parking_status: "yes" })
                .then(() => {
                    alert("Parking confirmed!");
                    setStatus("yes");
                    navigate("/admin/dashboard");
                })
                .catch(() => {
                    alert("Failed to update parking status.");
                });
        }
    };

    return (
        <div style={styles.container}>
            <button onClick={() => navigate("/admin/dashboard")} style={styles.backButton}>
                ← Back to Dashboard
            </button>

            <h1 style={styles.heading}>Scan QR Code</h1>

            {!scannerActive && (
                <>
                    <FaQrcode size={80} style={styles.icon} />
                    <br />
                    <button onClick={() => setScannerActive(true)} style={styles.button}>
                        Start Scanning
                    </button>
                </>
            )}

            {scannerActive && <div id="reader" style={styles.scanner}></div>}

            {error && <p style={styles.error}>{error}</p>}

            {booking && (
                <div style={styles.bookingDetails}>
                    <h2 style={styles.subHeading}>Booking Details</h2>
                    <p><strong>Owner:</strong> {booking.owner_name}</p>
                    <p><strong>Car Number:</strong> {booking.car_number}</p>
                    <p><strong>Slot ID:</strong> {booking.slot_id}</p>
                    <p><strong>Cost:</strong> Rs.{booking.total_cost}</p>
                    <p><strong>Status:</strong> {status === "yes" ? "Checked In" : status === "expired" ? "Checked Out" : "Not Checked In"}</p>

                    {/* Only show entry window if the status is "not checked in" */}
                    {status !== "yes" && status !== "expired" && entryWindow && (
                        <p style={{ color: "#555", marginTop: "8px", fontWeight: "bold" }}>{entryWindow}</p>
                    )}

                    {status === "expired" && (
                        <p style={{ color: "gray", marginTop: "10px" }}>This ticket has already been used.</p>
                    )}

                    <input
                        type="text"
                        placeholder="Enter Vehicle Number"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value)}
                        style={styles.input}
                        disabled={status === "expired"}
                    />

                    <button
                        onClick={confirmParking}
                        style={{
                            ...styles.confirmButton,
                            backgroundColor: status === "expired" ? "#ccc" : "#28a745",
                            cursor: status === "expired" ? "not-allowed" : "pointer"
                        }}
                        disabled={status === "expired"}
                    >
                        {status === "yes" ? "Check Out" : "Confirm Parking"}
                    </button>
                </div>
            )}
        </div>
    );
};

// Style remains unchanged
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
        background: "#f5f5f5",
        overflow: "hidden",
        boxSizing: "border-box",
    },
    backButton: {
        alignSelf: "flex-start",
        marginBottom: "10px",
        backgroundColor: "#e0e0e0",
        border: "none",
        padding: "8px 16px",
        borderRadius: "4px",
        fontSize: "1rem",
        cursor: "pointer",
        marginLeft: "20px",
        color: "#333",
        transition: "background-color 0.3s",
    },
    heading: {
        fontSize: "2.5rem",
        color: "#333",
        marginBottom: "20px",
        textAlign: "center",
    },
    icon: {
        color: "#333",
        marginBottom: "10px",
    },
    button: {
        backgroundColor: "#333",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        fontSize: "1.1rem",
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginBottom: "40px",
    },
    scanner: {
        marginTop: "20px",
        marginBottom: "20px",
        width: "100%",
        maxWidth: "400px",
        height: "auto",
        aspectRatio: "1",
        display: "block",
        margin: "20px auto",
    },
    error: {
        color: "red",
        fontSize: "1.1rem",
    },
    bookingDetails: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        marginTop: "30px",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "left",
        width: "100%",
    },
    subHeading: {
        fontSize: "1.8rem",
        color: "#333",
        marginBottom: "10px",
    },
    input: {
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
        width: "100%",
        fontSize: "1rem",
    },
    confirmButton: {
        color: "#fff",
        padding: "12px 24px",
        border: "none",
        borderRadius: "5px",
        fontSize: "1.2rem",
        width: "100%",
        marginTop: "20px",
        transition: "all 0.3s ease",
    },
};

export default ScanQR;
