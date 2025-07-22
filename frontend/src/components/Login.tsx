// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import AdminImg from '../assets/unsplash_EVgsAbL51Rk.png';

// const Login: React.FC = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         if (!email.match(/^\S+@\S+\.\S+$/)) {
//             setError('Invalid email format.');
//             return;
//         }

//         if (password.length < 6) {
//             setError('Password must be at least 6 characters.');
//             return;
//         }

//         try {
//             const res = await axios.post('http://localhost:8000/api/login/', { email, password });
//             localStorage.setItem('token', res.data.token);
//             setSuccess('Login successful! Redirecting...');
//             setTimeout(() => navigate('/admin/create-event'), 1000);
//         } catch (err: any) {
//             setError(err.response?.data?.detail || 'Login failed.');
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
//             <div className="flex w-full max-w-5xl h-[700px] shadow-lg rounded-lg overflow-hidden">
//                 <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
//                     <div className="text-center mb-8">
//                         <h1 className="text-black font-bold mb-2 text-lg">Event <span className='text-lg text-purple-500'>Hive</span></h1>
//                         <h2 className="text-2xl font-bold">Sign In to Event Hive</h2>
//                     </div>
//                     {error && <div className="text-red-500 mb-4">{error}</div>}
//                     {success && <div className="text-green-500 mb-4">{success}</div>}
//                     <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
//                         <div className="mb-6">
//                             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                                 YOUR EMAIL
//                             </label>
//                             <input
//                                 id="email"
//                                 type="email"
//                                 placeholder="Enter your email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-purple-500"
//                                 required
//                             />
//                         </div>
//                         <div className="mb-8">
//                             <div className="flex justify-between items-center">
//                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                                     PASSWORD
//                                 </label>
//                                 <a href="#" className="text-sm text-gray-500">Forgot your password?</a>
//                             </div>
//                             <input
//                                 id="password"
//                                 type="password"
//                                 placeholder="Enter your password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-purple-500"
//                                 required
//                             />
//                         </div>
//                         <button
//                             type="submit"
//                             className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition duration-200"
//                         >
//                             Sign In
//                         </button>
//                     </form>

//                 </div>
                // <div
                //     className="w-1/2 bg-cover bg-center"
                //     style={{ backgroundImage: `url(${AdminImg})` }}
                // >
//                     {/* Background image applied here */}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;
"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Info, Mail, Lock, Eye, EyeOff } from "lucide-react"
import AdminImg from '../assets/unsplash_EVgsAbL51Rk.png';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    const trimmedEmail = email.toLowerCase().trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail.match(/^\S+@\S+\.\S+$/)) {
      setError("Invalid email format.")
      return
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    try {
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Login failed.")
      }

      const data = await res.json()
      localStorage.setItem("token", data.token)
      setSuccess("Login successful! Redirecting...")
      setTimeout(() => navigate("/admin/create-event"), 1000)
    } catch (err: any) {
      setError(err.message || "Login failed.")
    }
  }

  const handleSignUp = () => {
    navigate("/admin/register")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex w-full max-w-5xl h-[700px] shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel - Login Form */}
        <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-black font-bold mb-2 text-lg">
              Event <span className="text-lg text-purple-500">Hive</span>
            </h1>
            <h2 className="text-2xl font-bold">Sign In to Event Hive</h2>
          </div>
          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-400 bg-red-50 text-red-700 flex items-start gap-2 text-sm">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-lg border border-green-400 bg-green-50 text-green-700 flex items-start gap-2 text-sm">
              <Info className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <div>{success}</div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                YOUR EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  PASSWORD
                </label>
                <a href="#" className="text-sm text-gray-500 hover:underline">
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition duration-200 shadow-md"
            >
              Sign In
            </button>
          </form>
        </div>
        {/* Right Panel - Image and Hello Friend */}
        <div
          className="w-1/2 bg-cover bg-center relative hidden lg:flex items-center justify-center"
            style={{ backgroundImage: `url(${AdminImg})` }}
        >
          <div className="absolute inset-0 bg-black opacity-50" /> {/* Overlay for brightness */}
          <div className="relative z-10 text-white text-center p-8">
            <h2 className="text-4xl font-bold mb-4">Hello Friend</h2>
            <p className="text-lg mb-8 max-w-xs mx-auto">
              To keep connected with us please register with your personal info
            </p>
            <button
              onClick={handleSignUp}
              className="px-8 py-3 bg-white bg-opacity-20 border border-black text-black rounded-full text-lg font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
