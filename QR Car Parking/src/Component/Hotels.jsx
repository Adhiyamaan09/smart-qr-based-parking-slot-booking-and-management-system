import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3006/auth/hotels")
            .then(response => {
                if (response.data.Status) {
                    setHotels(response.data.hotels);
                } else {
                    setError("No hotel data available.");
                }
            })
            .catch(err => {
                console.error("Error fetching hotel data:", err);
                setError("Error loading hotel details.");
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

    const filteredHotels = hotels.filter((hotel) =>
        `${hotel.name} ${hotel.city} ${hotel.state} ${hotel.country}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">🏨 Hotel Locations</h2>

            {/* Highlighted Search Bar */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control shadow-sm border-primary border-2 rounded-pill px-4 py-2"
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
                    {filteredHotels.length > 0 ? (
                        filteredHotels.map((hotel) => (
                            <div
                                key={hotel.id}
                                className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
                                onMouseEnter={() => setHoveredId(hotel.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div
                                    className="card text-center w-100"
                                    style={{
                                        ...cardStyle,
                                        ...(hoveredId === hotel.id ? hoverStyle : {}),
                                    }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{hotel.name}</h5>
                                        <p className="card-text text-muted small">
                                            {hotel.address}, {hotel.city}, {hotel.state}, {hotel.country}
                                        </p>
                                        <Link
                                            to={`/book-slot/${hotel.id}`}
                                            className="btn btn-primary w-100 mt-3"
                                        >
                                            Book Slot
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No hotels match your search.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Hotels;
