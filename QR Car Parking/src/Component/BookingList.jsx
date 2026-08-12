import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3006/auth/bookings')
            .then(response => {
                setBookings(response.data.bookings);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
                setError('There is No Recent Booking');
            });
    }, []);

    return (
        <div className="booking-list-wrapper">
            <div className="card booking-list-card shadow-lg p-4 ">
                <h2 className="text-center mb-4">Recent Bookings</h2>

                {error ? (
                    <div className="alert alert-warning text-center">{error}</div>
                ) : bookings.length === 0 ? (
                    <p className="text-muted text-center">No bookings found.</p>
                ) : (
                    <ul className="list-group">
                        {bookings.map(booking => (
                            <li key={booking.id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{booking.owner_name}</strong> <span className="text-muted">({booking.car_number})</span>
                                </div>
                                <Link to={`/dashboard/booking/${booking.id}`} className="btn btn-sm btn-primary">
                                    View Details
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <style>{`
                .booking-list-wrapper {
                    background-color: white;
                    min-height: 75vh;
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                    align-items: start;
                }
                .booking-list-card {
                    width: 100%;
                    max-width: 600px;
                    background: white;
                    border-radius: 16px;
                }
            `}</style>
        </div>
    );
};

export default BookingList;  