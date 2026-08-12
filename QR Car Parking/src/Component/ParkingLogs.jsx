import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParkingLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [placeName, setPlaceName] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [showPrompt, setShowPrompt] = useState(true);

    const navigate = useNavigate();

    const fetchParkingLogs = async () => {
        setLoading(true);
        setError("");
        setLogs([]);

        try {
            const response = await axios.get("http://localhost:3006/admin/parkinglogs", {
                params: {
                    id: placeId.trim(),
                    place_name: placeName.trim(),
                },
            });

            if (response.data.length === 0) {
                setError("No parking logs found for the given criteria. Please enter the correct ID and place name.");
            } else {
                setLogs(response.data);
            }
        } catch (err) {
            console.error("Error fetching parking logs:", err);
            setError("Mismatched ID and Place Name. Please enter the correct ID and Name.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!placeId.trim() || !placeName.trim()) {
            setError("Both Place ID and Place Name are required.");
            return;
        }
        fetchParkingLogs();
        setShowPrompt(false);
    };

    const handleSearchAgain = () => {
        setShowPrompt(true);
        setPlaceId("");
        setPlaceName("");
        setLogs([]);
        setError("");
    };

    const groupLogsByLocation = () => {
        return logs.reduce((acc, log) => {
            const key = `${log.location_type} - ${log.location_name}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(log);
            return acc;
        }, {});
    };

    const groupedLogs = groupLogsByLocation();

    const modalOverlayStyle = {
        display: "block",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    };

    const modalContentStyle = {
        borderRadius: "1.25rem",
        border: "none",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
    };

    const buttonStyle = {
        borderRadius: "50px",
        padding: "10px 20px",
        fontWeight: "500",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
    };

    return (
        <div className="container mt-4">
            <button
                className="btn btn-outline-secondary mb-3"
                style={buttonStyle}
                onClick={() => navigate("/admin/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <h2 className="text-center mb-4 fw-bold text-dark">📋 Parking Logs</h2>

            {showPrompt && (
                <div className="modal" style={modalOverlayStyle}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={modalContentStyle}>
                            <div className="modal-header">
                                <h5 className="modal-title fw-semibold">Enter Search Parameters</h5>
                                <button type="button" className="btn-close" onClick={() => setShowPrompt(false)}></button>
                            </div>
                            <div className="modal-body">
                                {error && <p className="text-danger fw-medium">{error}</p>}
                                <label htmlFor="placeId" className="form-label fw-semibold">Place ID</label>
                                <input
                                    type="number"
                                    id="placeId"
                                    className="form-control mb-3"
                                    value={placeId}
                                    onChange={(e) => setPlaceId(e.target.value)}
                                    placeholder="e.g. 1"
                                />
                                <label htmlFor="placeName" className="form-label fw-semibold">Place Name</label>
                                <input
                                    type="text"
                                    id="placeName"
                                    className="form-control mb-2"
                                    value={placeName}
                                    onChange={(e) => setPlaceName(e.target.value)}
                                    placeholder="e.g. City Mall"
                                />
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-danger" style={buttonStyle} onClick={() => setShowPrompt(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" style={buttonStyle} onClick={handleSearch}>
                                     Search Logs
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading && <p className="text-center fw-medium">Loading logs...</p>}
            {error && !showPrompt && <p className="text-danger text-center fw-semibold">{error}</p>}
            {!loading && logs.length === 0 && !error && !showPrompt && (
                <p className="text-center text-muted">No parking logs found for the given criteria.</p>
            )}

            {!loading && Object.keys(groupedLogs).length > 0 && (
                <>
                    {Object.keys(groupedLogs).map((location) => (
                        <div key={location} className="mb-5">
                            <h4 className="text-center text-primary fw-bold mb-3">{location}</h4>
                            <div className="table-responsive">
                                <table className="table table-hover table-bordered align-middle text-center shadow-sm">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Slot ID</th>
                                            <th>Owner</th>
                                            <th>Contact</th>
                                            <th>Car Number</th>
                                            <th>Car Model</th>
                                            <th>Booking Time</th>
                                            <th>Hours</th>
                                            <th>Cost</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedLogs[location].map((log) => (
                                            <tr key={log.id}>
                                                <td>{log.id}</td>
                                                <td>{log.slot_id}</td>
                                                <td>{log.owner_name}</td>
                                                <td>{log.owner_contact}</td>
                                                <td>{log.car_number}</td>
                                                <td>{log.car_model}</td>
                                                <td>{new Date(log.booking_time).toLocaleString()}</td>
                                                <td>{log.hours}</td>
                                                <td>₹{log.total_cost}</td>
                                                <td>
                                                    <span className={`badge rounded-pill px-3 py-2 ${log.parking_status === "yes"
                                                        ? "bg-success"
                                                        : log.parking_status === "expired"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                        }`}>
                                                        {log.parking_status.toUpperCase()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    <div className="text-center mt-4">
                        <button className="btn btn-warning" style={buttonStyle} onClick={handleSearchAgain}>
                             Search Again
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ParkingLogs;
