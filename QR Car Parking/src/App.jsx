import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css' 
import './App.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Component/Login'
import Home from './Component/Home'
import Cost from './Component/Cost'
import Booking from './Component/Booking'
import Logout from './Component/Logout'
import Register from './Component/Register'
import Dashboard from './Component/Dashboard'
import Hotels from './Component/Hotels'
import Theaters from './Component/Theaters'
import Malls from './Component/Malls'
import BookSlot from './Component/BookSlot'
import BookingList from './Component/BookingList'
import AdminLogin from './Component/AdminLogin'
import AdminDashboard from './Component/AdminDashboard'
import ScanQR from './Component/ScanQR'
import ParkingLogs from './Component/ParkingLogs'
import ParkingManager from './Component/ParkingManager'






function App() {

  return (
    <BrowserRouter>
    <Routes>

    <Route path="/" element={<Navigate to="/userlogin" replace />} />
    <Route path='/userlogin' element={<Login />}></Route>
    <Route path='/register' element={<Register/>}></Route>

    <Route path='/adminlogin' element={<AdminLogin />}></Route>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/admin/scanqr" element={<ScanQR />} />
    <Route path="/admin/parkinglogs" element={<ParkingLogs />} />

    <Route path="/parkingmanager" element={<ParkingManager />}></Route>
    <Route path="/book-slot/:location_id" element={<BookSlot />} />

    <Route path="/dashboard" element={<Dashboard />}>
    <Route path='' element={<Home />}></Route>
    <Route path='/dashboard/hotel' element={<Hotels />}></Route>
    <Route path='/dashboard/theater' element={<Theaters />}></Route>
    <Route path='/dashboard/mall' element={<Malls />}></Route>
    <Route path='/dashboard/cost' element={<Cost />}></Route>
    <Route path="/dashboard/bookings" element={<BookingList />} />
    <Route path="/dashboard/booking/:id" element={<Booking />} />
    
    </Route> 
    </Routes>
    </BrowserRouter>
  )
}

export default App
