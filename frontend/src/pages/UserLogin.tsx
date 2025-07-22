"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Info, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Signin from "../assets/unsplash_EVgsAbL51Rk.png";

const UserLogin: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const trimmedEmail = email.toLowerCase().trim()
        const trimmedPassword = password.trim()

        if (!trimmedEmail || !trimmedPassword) {
            setError("Email and password are required.")
            return
        }

        try {
            const res = await fetch("http://localhost:8000/api/user/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    password: trimmedPassword,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Login failed.")
            }

            const data = await res.json()
            localStorage.setItem("token", data.token)
            setSuccess("Logged in successfully! Redirecting...")
            setEmail("")
            setPassword("")
            setTimeout(() => {
                navigate("/browse-events")
            }, 800)
        } catch (err: any) {
            setError(err.message || "Login failed.")
        }
    }

    const handleSignUp = () => {
        navigate("/user/register")
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Panel - Login Form */}
            <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Event <span className="text-purple-700">Hive</span>
                        </h2>
                        <h3 className="text-3xl font-bold text-gray-900 mt-4">Sign In to Event Hive</h3>
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

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            YOUR EMAIL
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                            PASSWORD
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value.trim())}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        <div className="text-right mt-2">
                            <a href="#" className="text-sm text-purple-600 hover:underline">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-purple-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>

            {/* Right Panel - Image and Hello Friend */}
            <div className="relative hidden lg:flex w-1/2 items-center justify-center p-8 overflow-hidden">
                <img
                    src={Signin}
                    alt="Hello Friend background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-75"
                />
                <div className="relative z-10 text-white text-center">
                    <h2 className="text-4xl font-bold mb-4">Hello Friend</h2>
                    <p className="text-lg mb-8 max-w-xs mx-auto">
                        To keep connected with us please provide us with your information
                    </p>
                    <button
                        onClick={handleSignUp}
                        className="px-8 py-3 bg-white bg-opacity-20 border border-white text-black rounded-full text-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserLogin
