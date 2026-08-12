import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Malls = () => {
    const [malls, setMalls] = useState([]);
    const [error, setError] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3006/auth/malls")
            .then(response => {
                if (response.data.Status) {
                    setMalls(response.data.malls);
                } else {
                    setError("No mall data available.");
                }
            })
            .catch(err => {
                console.error("Error fetching mall data:", err);
                setError("Error loading mall details.");
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

    const filteredMalls = malls.filter((mall) =>
        `${mall.name} ${mall.city} ${mall.state} ${mall.country}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">🛍️ Mall Locations</h2>

            {/* Highlighted Search Bar */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control shadow-sm border-success border-2 rounded-pill px-4 py-2"
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
                    {filteredMalls.length > 0 ? (
                        filteredMalls.map((mall) => (
                            <div
                                key={mall.id}
                                className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
                                onMouseEnter={() => setHoveredId(mall.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div
                                    className="card text-center w-100"
                                    style={{
                                        ...cardStyle,
                                        ...(hoveredId === mall.id ? hoverStyle : {}),
                                    }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold">{mall.name}</h5>
                                        <p className="card-text text-muted small">
                                            {mall.address}, {mall.city}, {mall.state}, {mall.country}
                                        </p>
                                        <Link
                                            to={`/book-slot/${mall.id}`}
                                            className="btn btn-success w-100 mt-3"
                                        >
                                            Book Slot
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted">No malls match your search.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Malls;
