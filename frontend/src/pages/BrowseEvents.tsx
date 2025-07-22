
"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { CalendarDays, Clock, MapPin, Info, Search, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import Bgimg from "../assets/unsplash_F2KRf_QfCqw (2).png"
import Footer from "../components/Footer"

interface Event {
    _id: string
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

const BrowseEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([])
    const [lookingForFilter, setLookingForFilter] = useState("all")
    const [locationFilter, setLocationFilter] = useState("all")
    const [whenFilter, setWhenFilter] = useState("all")
    const [inactiveFilter, setInactiveFilter] = useState("all")
    const [eventTypeFilter, setEventTypeFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchEvents = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const params = new URLSearchParams()
            if (lookingForFilter !== "all") params.append("type", lookingForFilter)
            if (locationFilter !== "all") params.append("location", locationFilter)
            if (whenFilter !== "all") params.append("date", whenFilter)
            if (inactiveFilter !== "all") params.append("inactive", inactiveFilter)
            if (eventTypeFilter !== "all") params.append("eventType", eventTypeFilter)
            if (categoryFilter !== "all") params.append("category", categoryFilter)

            const url = `http://localhost:8000/api/events/browse/?${params.toString()}`
            const res = await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Failed to fetch events.")
            }

            const data = await res.json()
            setEvents(data.events)
        } catch (err: any) {
            setError(err.message || "Failed to fetch events.")
        } finally {
            setIsLoading(false)
        }
    }, [lookingForFilter, locationFilter, whenFilter, inactiveFilter, eventTypeFilter, categoryFilter])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="flex items-center justify-between p-4 md:px-8 bg-white shadow-sm">
                <div className="flex items-baseline gap-1">
                    <h1 className="text-2xl font-bold text-gray-900">Event</h1>
                    <span className="text-2xl font-bold text-purple-700">Hive</span>
                </div>
                <nav className="flex items-center gap-4">
                    <button className="px-4 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">Login</button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors shadow-md">
                        Signup
                    </button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
                <img
                    src={Bgimg}
                    alt="Event background"
                    className="absolute inset-0 w-full h-full object-cover filter brightness-50"
                />
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-wide">MADE FOR THOSE</h2>
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-wide mt-2">WHO DO</h2>
                </div>
                <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Previous"
                >
                    <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                    aria-label="Next"
                >
                    <ChevronRight className="h-8 w-8" />
                </button>

                {/* Main Filter Bar - positioned over the hero */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 w-[90%] max-w-4xl bg-purple-900 p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center justify-center">
                    <div className="flex flex-col w-full">
                        <label htmlFor="looking-for" className="text-sm text-gray-300 mb-1">
                            Looking For
                        </label>
                        <div className="relative">
                            <select
                                id="looking-for"
                                value={lookingForFilter}
                                onChange={(e) => setLookingForFilter(e.target.value)}
                                className="w-full bg-purple-800 text-white border border-purple-700 rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Choose event type</option>
                                <option value="free">Free</option>
                                <option value="paid">Paid</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="location" className="text-sm text-gray-300 mb-1">
                            Location
                        </label>
                        <div className="relative">
                            <select
                                id="location"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full bg-purple-800 text-white border border-purple-700 rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Choose location</option>
                                <option value="new-york">New York</option>
                                <option value="london">London</option>
                                <option value="paris">Paris</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex flex-col w-full">
                        <label htmlFor="when" className="text-sm text-gray-300 mb-1">
                            When
                        </label>
                        <div className="relative">
                            <select
                                id="when"
                                value={whenFilter}
                                onChange={(e) => setWhenFilter(e.target.value)}
                                className="w-full bg-purple-800 text-white border border-purple-700 rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Choose date and time</option>
                                <option value="today">Today</option>
                                <option value="this-week">This Week</option>
                                <option value="this-month">This Month</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                        </div>
                    </div>
                    <button
                        onClick={fetchEvents}
                        className="w-full md:w-auto px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-300 rounded-md shadow-md flex items-center justify-center"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            </section>

            {/* Content Section below hero and main filter */}
            <div className="pt-[100px] p-6 md:p-8 lg:p-10">
                {" "}
                {/* Padding to account for overlapping filter bar */}
                {/* Upcoming Events Header and Filters */}
                <div className="mx-auto max-w-6xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-3xl font-bold text-gray-900">Upcoming</h2>
                        <span className="text-3xl font-bold text-purple-700">Events</span>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="relative">
                            <select
                                value={inactiveFilter}
                                onChange={(e) => setInactiveFilter(e.target.value)}
                                className="w-[150px] bg-white text-gray-700 border border-gray-300 rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Inactive</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                value={eventTypeFilter}
                                onChange={(e) => setEventTypeFilter(e.target.value)}
                                className="w-[150px] bg-white text-gray-700 border border-gray-300 rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Event type</option>
                                <option value="conference">Conference</option>
                                <option value="workshop">Workshop</option>
                                <option value="webinar">Webinar</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                        </div>
                        <div className="relative">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-[150px] bg-white text-gray-700 border border-gray-300 rounded-md py-2 pl-3 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Any category</option>
                                <option value="tech">Tech</option>
                                <option value="art">Art</option>
                                <option value="music">Music</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
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
                {/* Event Listing */}
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
                            <p className="text-center text-gray-600 text-lg">No events found matching your criteria.</p>
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
            <Footer />
        </div>
    )
}

export default BrowseEvents
