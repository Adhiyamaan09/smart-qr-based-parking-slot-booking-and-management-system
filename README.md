# Smart QR-Based Parking Slot Booking and Management System

A web-based parking management system that allows vehicle owners to book parking slots, generate QR-based parking tickets, and verify parking entry using QR scanning. Parking owners and administrators can manage parking slots, bookings, vehicles, and parking records.

## Features

### User Features

- User registration and login
- View available parking locations
- View hotel, theater, and mall parking facilities
- View parking rates
- Check available parking slots
- Select parking date, time, and duration
- Book parking slots
- Enter vehicle details
- Automatic parking cost calculation
- Generate QR-based parking tickets
- Download parking tickets
- View booking details
- View booking history

### Admin and Parking Owner Features

- Administrator login
- Admin dashboard
- Parking slot management
- View booking records
- QR ticket scanning
- Vehicle and booking verification
- Parking status management
- Parking logs
- Parking record management

## Technology Stack

### Frontend

- React.js
- Vite
- Bootstrap
- Axios
- React Router
- QRCode React
- HTML5 QR Code
- HTML2Canvas
- jsPDF
- Framer Motion
- Lottie React
- React Icons
- Bootstrap Icons

### Backend

- Node.js
- Express.js
- MySQL2
- JWT
- bcrypt
- CORS
- Cookie Parser
- Nodemon
- dotenv

### Database

- MySQL 8.0+

## Project Structure

```text
smart-qr-based-parking-slot-booking-and-management-system/

├── database/
│   └── parking_database.sql
│
├── QR Car Parking/
│   ├── public/
│   ├── src/
│   │   ├── Component/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Server/
│   ├── Routes/
│   ├── middlewares/
│   ├── utils/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

## System Workflow

1. User registers or logs into the system.
2. User selects a parking location.
3. User checks available parking slots.
4. User selects a parking slot and duration.
5. User enters vehicle details.
6. User confirms the booking.
7. The system calculates the parking cost.
8. The system generates a QR-based parking ticket.
9. The user presents the QR ticket at the parking entrance.
10. The parking owner or administrator scans the QR code.
11. The booking and vehicle details are verified.
12. Parking records are maintained by the system.

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Adhiyamaan09/smart-qr-based-parking-slot-booking-and-management-system.git
cd smart-qr-based-parking-slot-booking-and-management-system
```

### 2. Set Up the MySQL Database

Make sure MySQL Server is installed and running.

Create the database using MySQL Workbench or the MySQL command line:

```sql
CREATE DATABASE cps;
```

The database structure is available in:

```text
database/parking_database.sql
```

Import the SQL file into MySQL Workbench.

The database contains the following tables:

- `users`
- `admin`
- `location`
- `parking_rates`
- `slots`
- `bookings`

### 3. Set Up the Backend

Open a terminal and navigate to the Server directory:

```bash
cd Server
```

Install the required dependencies:

```bash
npm install
```

Create a file named `.env` inside the Server directory.

Add the following configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cps
JWT_SECRET=your_jwt_secret
```

Replace `your_mysql_password` with your MySQL password.

Set `JWT_SECRET` to a secure random value.

Start the backend server:

```bash
npm start
```

The backend should start successfully and connect to the MySQL database.

### 4. Set Up the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd "QR Car Parking"
```

Install the required dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Vite will display the local development URL:

```text
http://localhost:5173
```

Open the URL in a web browser.

## Running the Project

The backend and frontend must be running at the same time.

### Backend

```bash
cd Server
npm install
npm start
```

### Frontend

```bash
cd "QR Car Parking"
npm install
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

## QR-Based Parking Ticket

After successfully booking a parking slot, the system generates a QR-based parking ticket.

The ticket contains booking-related information such as:

- Booking ID
- Owner name
- Vehicle number
- Vehicle model
- Parking location
- Parking slot
- Booking time
- Parking duration
- Total cost
- QR code

The parking owner or administrator can scan the QR code to verify the booking and vehicle information.

## Parking Cost Calculation

The parking cost is calculated based on the parking rate and selected duration.

```text
Total Cost = Cost Per Hour × Number of Hours
```

Different parking locations can have different parking rates.

The parking rates are maintained in the `parking_rates` table.

## Database

The application uses a MySQL database named `cps`.

The main database tables are:

### users

Stores registered user information.

### admin

Stores administrator information.

### location

Stores parking location information.

### parking_rates

Stores parking rates for different parking location types.

### slots

Stores parking slot information and availability.

### bookings

Stores parking booking information, vehicle details, duration, cost, and parking status.

The complete database structure is available in:

```text
database/parking_database.sql
```

## Environment Variables

The backend uses environment variables to store database credentials and authentication secrets.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=cps
JWT_SECRET=your_jwt_secret
```

The `.env` file must not be uploaded to GitHub because it contains sensitive information.

The `.gitignore` file excludes sensitive environment files and dependency folders.

## API Overview

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/userlogin
```

### Parking Locations

```text
GET /auth/hotels
GET /auth/theaters
GET /auth/malls
GET /auth/costs
```

### Parking Slots

```text
GET /auth/slots/:location_id
POST /auth/slots/book
```

### Bookings

```text
GET /auth/bookings
GET /auth/bookings/:id
```

### Administration

```text
POST /admin/adminlogin
GET /admin/parkinglogs
```

## Troubleshooting

### MySQL Connection Error

Check that:

- MySQL Server is running.
- The `cps` database exists.
- The `.env` file is inside the Server directory.
- The MySQL username and password are correct.
- The required database tables have been imported.

### Frontend Not Starting

Run:

```bash
cd "QR Car Parking"
npm install
npm run dev
```

### Backend Not Starting

Run:

```bash
cd Server
npm install
npm start
```

### QR Scanner Not Working

Check that:

- Browser camera permission is enabled.
- A working camera is available.
- The QR code is clearly visible.
- The browser supports camera access.

## License

This project is developed for educational and portfolio purposes.

## Author

Adhiyamaan09

GitHub:

https://github.com/Adhiyamaan09
