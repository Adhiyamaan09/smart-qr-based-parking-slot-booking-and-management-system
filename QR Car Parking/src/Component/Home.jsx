import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [counts, setCounts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:3006/auth/dashboard")
            .then(response => {
                if (response.data.Status) {
                    setCounts(response.data.counts);
                } else {
                    setError("No data available");
                }
            })
            .catch(() => {
                setError("Error loading dashboard data");
            });
    }, []);

    const cardStyles = {
        borderRadius: "20px",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        backgroundColor: "#fff",
    };

    const hoverEffect = {
        transform: "scale(1.02)",
    };

    const [hovered, setHovered] = useState("");

    const renderCard = (title, count, color, link, type) => (
        <div
            className="col-md-4 mb-4"
            onMouseEnter={() => setHovered(type)}
            onMouseLeave={() => setHovered("")}
        >
            <div
                className="p-4 text-center"
                style={{
                    ...cardStyles,
                    ...(hovered === type ? hoverEffect : {}),
                    borderTop: `4px solid ${color}`,
                }}
            >
                <h3 className="mb-3">{title}</h3>
                <p className="fs-5"><strong>Total {title}:</strong> {count}</p>
                <Link to={link} className={`btn w-100`} style={{ backgroundColor: color, color: "white" }}>
                    View {title}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="container py-5">
            <h1 className="text-center mb-5">Dashboard Overview</h1>
            {counts ? (
                <div className="row justify-content-center">
                    {renderCard("Hotels", counts.hotels, "#007bff", "/dashboard/hotel", "hotels")}
                    {renderCard("Theaters", counts.theaters, "#dc3545", "/dashboard/theater", "theaters")}
                    {renderCard("Malls", counts.malls, "#28a745", "/dashboard/mall", "malls")}
                </div>
            ) : (
                <div className="text-center text-danger fs-5">{error ? error : "Loading..."}</div>
            )}
        </div>
    );
};

export default Home;
