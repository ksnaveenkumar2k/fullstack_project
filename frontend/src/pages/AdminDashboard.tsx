"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { CalendarDays, Clock, MapPin, Info, PlusCircle } from "lucide-react" // Added PlusCircle icon
import { useNavigate } from "react-router-dom" // Import useNavigate
import fullimg from "../../src/assets/Large_Full Image.png" // Preserved original image import

interface Event {
    _id: string // Changed id to _id to match backend response in BrowseEvents
    title: string
    venue: string
    start_date: string
    end_date: string
    start_time: string
    end_time: string
    cost_type: string
    description?: string
    image?: string
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate() // Initialize useNavigate
    const [events, setEvents] = useState<Event[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Unauthorized: Please login.")
                    setIsLoading(false)
                    navigate("/login") // Redirect to login if no token
                    return
                }
                const res = await fetch("http://localhost:8000/api/admin/dashboard/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                if (!res.ok) {
                    const errorData = await res.json()
                    // If the error is due to unauthorized access (e.g., 401 status)
                    if (res.status === 401) {
                        setError("Session expired or unauthorized. Please login again.")
                        localStorage.removeItem("token") // Clear invalid token
                        navigate("/login") // Redirect to login
                    } else {
                        throw new Error(errorData.detail || "Failed to fetch events.")
                    }
                }
                const data = await res.json()
                setEvents(data.events)
            } catch (err: any) {
                setError(err.message || "Failed to fetch events.")
            } finally {
                setIsLoading(false)
            }
        }
        fetchEvents()
    }, [navigate]) // Add navigate to dependency array

    const handleCreateEventClick = () => {
        navigate("/admin/create-event")
    }

    const handleLogout = () => {
        localStorage.removeItem("token") // Clear the JWT token
        navigate("/login") // Redirect to the login page
    }


    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8 lg:p-10">
            {/* Header Section */}
            <div className="mx-auto max-w-6xl mb-8 flex items-center justify-between">
                {" "}
                {/* Added justify-between */}
                <div className="flex items-baseline gap-2">
                    <h1 className="text-4xl font-bold text-gray-900">Event</h1>
                    <span className="text-4xl font-bold text-purple-700">Hive</span>
                </div>
                <button
                    onClick={handleCreateEventClick}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
                >
                    <PlusCircle className="h-5 w-5" />
                    Create Event
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-red-300"
                >
                    Logout
                </button>
            </div>
            {/* Hero Section */}
            <div className="mx-auto max-w-6xl mb-10 relative bg-[#6A0DAD] rounded-lg overflow-hidden shadow-lg h-[350px] flex items-center p-8">
                <img
                    src={fullimg}
                    alt="Event illustration"
                    className="absolute inset-0 w-full h-full object-cover object-right-bottom opacity-80"
                />
            </div>
            {/* Error Message */}
            {error && (
                <div className="mx-auto max-w-6xl mb-6 p-4 rounded-lg border border-red-400 bg-red-50 text-red-700 flex items-start gap-2">
                    <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold">Error</h4>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}
            {/* Listed Events Section */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 mx-auto max-w-6xl">Listed Events</h2>
            {/* Loading State */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                            <div className="relative w-full h-40 bg-gray-200 rounded-t-lg">
                                <div className="absolute top-2 left-2 bg-gray-300 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full w-12 h-6" />
                            </div>
                            <div className="p-4 pb-2">
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                            <div className="p-4 pt-0 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-full" />
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    {events.length === 0 && !error ? (
                        <p className="text-center text-gray-600 text-lg">No events found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
                            {events.map((event) => (
                                <div key={event._id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                                    {event.image && (
                                        <div className="relative w-full h-40 overflow-hidden bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={
                                                    event.image.startsWith("data:image") ? event.image : `data:image/jpeg;base64,${event.image}`
                                                }
                                                alt={event.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <span
                                                className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${event.cost_type.toLowerCase() === "free"
                                                    ? "bg-green-500 text-white"
                                                    : "bg-yellow-500 text-white"
                                                    }`}
                                            >
                                                {event.cost_type.toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="p-4 pb-2">
                                        <h3 className="text-lg font-semibold line-clamp-2 text-gray-900">{event.title}</h3>
                                        <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            {event.venue}
                                        </p>
                                    </div>
                                    <div className="flex-grow p-4 pt-0 space-y-2 text-sm text-gray-700">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-4 w-4 text-gray-500" />
                                            <span>
                                                {event.start_date} - {event.end_date}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span>
                                                {event.start_time} - {event.end_time}
                                            </span>
                                        </div>
                                        {event.description && <p className="text-gray-700 mt-2 line-clamp-3">{event.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default AdminDashboard
