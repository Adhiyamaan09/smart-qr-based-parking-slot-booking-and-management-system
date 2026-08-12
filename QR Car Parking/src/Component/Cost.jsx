import React, { useEffect, useState } from "react";
import axios from "axios";

const Cost = () => {
    const [costs, setCosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3006/auth/costs")
            .then(response => {
                if (response.data.Status) {
                    setCosts(response.data.costs);
                } else {
                    setError("No parking cost data found");
                }
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                setError("Error fetching parking costs");
            });
    }, []);

    const cardStyle = {
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
        backgroundColor: "#fefefe",
        minWidth: "280px",
        maxWidth: "320px",
        margin: "0 15px",
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-5"> Parking Costs</h2>

            {costs ? (
                <div className="d-flex justify-content-center flex-wrap gap-4">
                    {/* Hotel Card */}
                    <div
                        className="p-4 text-center"
                        style={cardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <h4 className="mb-3 text-primary">🏨 Hotel</h4>
                        <hr />
                        <p className="fs-5">
                            <strong>Cost Per Hour:</strong> <i className="bi bi-currency-rupee">{costs.hotel}</i>
                        </p>
                    </div>

                    {/* Theater Card */}
                    <div
                        className="p-4 text-center"
                        style={cardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <h4 className="mb-3 text-danger">🎬 Theater</h4>
                        <hr />
                        <p className="fs-5">
                            <strong>Cost Per Hour:</strong> <i className="bi bi-currency-rupee">{costs.theater}</i>
                        </p>
                    </div>

                    {/* Mall Card */}
                    <div
                        className="p-4 text-center"
                        style={cardStyle}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                    >
                        <h4 className="mb-3 text-success">🛍️ Mall</h4>
                        <hr />
                        <p className="fs-5">
                            <strong>Cost Per Hour:</strong> <i className="bi bi-currency-rupee">{costs.mall}</i>
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-danger text-center mt-5 fs-5">{error ? error : "Loading..."}</div>
            )}
        </div>
    );
};

export default Cost; 