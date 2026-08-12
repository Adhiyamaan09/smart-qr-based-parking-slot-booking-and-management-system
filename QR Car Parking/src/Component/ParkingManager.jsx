import React, { useState } from "react";
import "./ParkingManager.css";

const ParkingManager = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isParking, setIsParking] = useState(false);

  const handleSlotClick = (index) => {
    if (!isParking) {
      setSelectedSlot(index);
      setIsParking(true);
      setTimeout(() => setIsParking(false), 1000); // Simulate parking delay
    }
  };

  return (
    <div className="parking-container">
      <div className="navbar">🚗 PARKING MANAGER v2.0</div>

      <div className="dashboard">
        <div className="parking-lot">
          <div className="parking-row">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`parking-slot ${selectedSlot === index ? "occupied" : ""}`}
                onClick={() => handleSlotClick(index)}
              >
                {index + 1}
                {selectedSlot === index && (
                  <img
                    src="/Images/car1.png"  // Image should be in the "public" folder
                    alt="Car"
                    className="car"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="road"></div>

          <div className="parking-row">
            {[5, 6, 7, 8, 9].map((index) => (
              <div
                key={index}
                className={`parking-slot ${selectedSlot === index ? "occupied" : ""}`}
                onClick={() => handleSlotClick(index)}
              >
                {index + 1}
                {selectedSlot === index && (
                  <img
                    src="/Images/car1.png"
                    alt="Car"
                    className="car"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="outside">🚙 Entry / Exit</div>
      </div>
    </div>
  );
};

export default ParkingManager;
