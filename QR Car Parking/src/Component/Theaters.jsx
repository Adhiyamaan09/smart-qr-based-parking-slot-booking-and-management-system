import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Theaters = () => {
    const [theaters, setTheaters] = useState([]);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3006/auth/theaters")
            .then(response => {
                if (response.data.Status) {
                    setTheaters(response.data.theaters);
                } else {
                    setError("No theater data available.");
                }
            })
            .catch(err => {
                console.error("Error fetching theater data:", err);
                setError("Error loading theater details.");
            });
    }, []);

    const cardStyle = {
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
    };

    const hoverStyle = {
        transform: "scale(1.03)",
    };

    const filteredTheaters = theaters.filter((theater) =>
        `${theater.name} ${theater.city} ${theater.state} ${theater.country}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">🎬 Theater Locations</h2>

            {/* Highlighted Search Bar */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control shadow-sm border-danger border-2 rounded-pill px-4 py-2"
                        placeholder="🔍 Search by name, city, state, or country"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            fontSize: "16px",
                            outline: "none",
                            transition: "0.3s ease-in-out",
                        }}
                    />
                </div>
            </div>

            {error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : (
                <div className="row justify-content-center">
                    {filteredTheaters.length > 0 ? (
                        filteredTheaters.map((theater) => (
                            <div
                                key={theater.id}
                                className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
                                onMouseEnter={() => setHoveredId(theater.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div
                                    className="card text-center w-100"
                                    style={{
                                        ...cardStyle,
                                        ...(hoveredId === theater.id ? hoverStyle : {}),
                                    }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{theater.name}</h5>
                                        <p className="card-text text-muted small">
                                            {theater.address}, {theater.city}, {theater.state}, {theater.country}
                                        </p>
                                        <Link
                                            to={`/book-slot/${theater.id}`}
                                            className="btn btn-danger w-100 mt-3"
                                        >
                                            Book Slot
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No theaters match your search.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Theaters;
