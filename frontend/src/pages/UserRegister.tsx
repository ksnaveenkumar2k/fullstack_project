"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Info, User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import signupimg from "../assets/unsplash_UCbMZ0S-w289.png"

const UserRegister: React.FC = () => {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<"Weak" | "Medium" | "Strong" | "">("")

    const checkPasswordStrength = (pw: string) => {
        let strength = 0
        if (pw.length >= 8) strength++
        if (/[A-Z]/.test(pw)) strength++
        if (/[a-z]/.test(pw)) strength++
        if (/\d/.test(pw)) strength++
        if (/[\W_]/.test(pw)) strength++ // Special characters

        if (strength <= 2) return "Weak"
        if (strength <= 4) return "Medium"
        return "Strong"
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value.trim() // Trim password
        setPassword(newPassword)
        setPasswordStrength(checkPasswordStrength(newPassword))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        // Trim values before validation
        const trimmedName = name.trim()
        const trimmedEmail = email.toLowerCase().trim() // Convert to lowercase and trim email
        const trimmedPassword = password.trim()
        const trimmedConfirmPassword = confirmPassword.trim()

        if (!trimmedName.match(/^[A-Za-z]+$/)) {
            // Updated regex to disallow spaces and special characters
            setError("Name must contain only alphabetic characters.")
            return
        }
        if (!trimmedEmail.match(/^\S+@\S+\.\S+$/)) {
            setError("Invalid email format.")
            return
        }
        if (trimmedPassword !== trimmedConfirmPassword) {
            setError("Passwords do not match.")
            return
        }
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
        if (!strongPasswordRegex.test(trimmedPassword)) {
            setError("Password must be at least 8 characters, include uppercase, lowercase, number, and special character.")
            return
        }

        try {
            const res = await fetch("http://localhost:8000/api/user/register/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: trimmedName,
                    email: trimmedEmail,
                    password: trimmedPassword,
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Registration failed.")
            }

            const data = await res.json()
            setSuccess("Registered successfully! Redirecting to login...")
            localStorage.setItem("token", data.token)
            setName("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setPasswordStrength("")
            setTimeout(() => {
                navigate("/user/login")
            }, 1500)
        } catch (err: any) {
            setError(err.message || "Registration failed.")
        }
    }

    const handleSignIn = () => {
        navigate("/user/login")
    }

    const getStrengthColor = (strength: string) => {
        switch (strength) {
            case "Weak":
                return "bg-red-500"
            case "Medium":
                return "bg-yellow-500"
            case "Strong":
                return "bg-green-500"
            default:
                return "bg-gray-300"
        }
    }

    const getStrengthWidth = (strength: string) => {
        switch (strength) {
            case "Weak":
                return "w-1/3"
            case "Medium":
                return "w-2/3"
            case "Strong":
                return "w-full"
            default:
                return "w-0"
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Panel - Image and Welcome Back */}
            <div className="relative hidden lg:flex w-1/2 items-center justify-center p-8 overflow-hidden">
                <img
                    src={signupimg}
                    alt="Welcome back background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-75"
                />
                <div className="relative z-10 text-white text-center">
                    <h2 className="text-4xl font-bold mb-4">Welcome back</h2>
                    <p className="text-lg mb-8 max-w-xs mx-auto">
                        To keep connected with us please login with your personal info
                    </p>
                    <button
                        onClick={handleSignIn}
                        className="px-8 py-3 bg-white bg-opacity-20 border border-white text-black rounded-full text-lg font-semibold hover:bg-gray-400 transition-all duration-300"
                    >
                        Sign In
                    </button>
                </div>
            </div>

            {/* Right Panel - Registration Form */}
            <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12 bg-white">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Event <span className="text-purple-700">Hive</span>
                        </h2>
                        <h3 className="text-3xl font-bold text-gray-900 mt-4">Sign Up to Event Hive</h3>
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
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                            YOUR NAME
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value.trim())} // Trim name and apply validation
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                            EMAIL
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.toLowerCase().trim())} // Convert to lowercase and trim email
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-5">
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
                                onChange={handlePasswordChange}
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
                        {password && (
                            <div className="mt-2">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(
                                            passwordStrength,
                                        )} ${getStrengthWidth(passwordStrength)}`}
                                    />
                                </div>
                                <p
                                    className={`text-xs mt-1 ${passwordStrength === "Weak" ? "text-red-500" : passwordStrength === "Medium" ? "text-yellow-600" : "text-green-600"}`}
                                >
                                    Password Strength: {passwordStrength}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            CONFIRM PASSWORD
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Enter your password again"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value.trim())} // Trim confirm password
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-purple-700 transition-colors duration-300 shadow-md focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    )
}

export default UserRegister
