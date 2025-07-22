// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';

// // Import pages
// import AdminRegister from '../src/components/AdminRegisterPage';
// import AdminDashboard from './pages/AdminDashboard';
// import AdminCreateEvent from './pages/AdminCreateEvent';
// import Login from './components/Login';
// import BrowseEvents from './pages/BrowseEvents';

// import UserRegister from './pages/UserRegister';
// import UserLogin from './pages/UserLogin';
// import HomePage from './pages/Home';

// const App: React.FC = () => {
//     return (
//         <Routes>
//             {/* Default: Redirect to user browse events */}
//             <Route path="/HomePage" element={<HomePage />} />

//             {/* Admin Routes */}
//             <Route path="/admin/register" element={<AdminRegister />} />
//             <Route path="/admin/dashboard" element={<AdminDashboard />} />
//             <Route path="/admin/create-event" element={<AdminCreateEvent />} />

//             {/* User Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/browse-events" element={<BrowseEvents />} />
//             <Route path="/user/register" element={<UserRegister />} />
//             <Route path="/user/login" element={<UserLogin />} />



//             {/* Fallback */}
//             <Route
//                 path="/HomePage"
//                 element={
//                     <div className="text-center mt-10 text-xl">
//                         404 - Page Not Found
//                     </div>
//                 }
//             />
//         </Routes>
//     );
// };

// export default App;
import type React from "react"
import { Routes, Route } from "react-router-dom"

// Import pages
import AdminRegister from "../src/components/AdminRegisterPage"
import AdminDashboard from "./pages/AdminDashboard"
import AdminCreateEvent from "./pages/AdminCreateEvent"
import Login from "./components/Login"
import BrowseEvents from "./pages/BrowseEvents"
import UserRegister from "./pages/UserRegister"
import UserLogin from "./pages/UserLogin"
import HomePage from "./pages/Home"

const App: React.FC = () => {
  return (
    <Routes>
      {/* Default route: Redirect to HomePage */}
      <Route path="/" element={<HomePage />} />
      <Route path="/HomePage" element={<HomePage />} />

      {/* Admin Routes */}
      <Route path="/admin/register" element={<AdminRegister />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/create-event" element={<AdminCreateEvent />} />

      {/* User Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/browse-events" element={<BrowseEvents />} />
      <Route path="/user/register" element={<UserRegister />} />
      <Route path="/user/login" element={<UserLogin />} />

      {/* Fallback route for 404 */}
      <Route path="*" element={<div className="text-center mt-10 text-xl">404 - Page Not Found</div>} />
    </Routes>
  )
}

export default App
