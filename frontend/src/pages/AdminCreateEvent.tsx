
"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Info } from "lucide-react" // Added Info icon
import { useNavigate } from "react-router-dom"

const AdminCreateEvent: React.FC = () => {
    const navigate = useNavigate()
    const [title, setTitle] = useState("")
    const [venue, setVenue] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [costType, setCostType] = useState("")
    const [description, setDescription] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false) // For AI generation

    const generateDescription = async () => {
        setError(null)
        setSuccess(null)
        setLoading(true)
        try {
            const res = await fetch("http://localhost:8000/api/events/generate-description/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title.trim(),
                    venue: venue.trim(),
                    start_date: startDate,
                    end_date: endDate,
                    cost_type: costType.trim(),
                }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || "Failed to generate description.")
            }

            const data = await res.json()
            setDescription(data.description)
            setSuccess("AI-generated description added. You can edit it before submitting.")
        } catch (err: any) {
            setError(err.message || "Failed to generate description.")
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size <= 5 * 1024 * 1024) {
                // 5MB limit
                const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
                if (!allowedTypes.includes(file.type)) {
                    setError("Only .jpg, .jpeg, .png formats are allowed for the image.")
                    setImageFile(null)
                    setImagePreview(null)
                    return
                }
                setImageFile(file)
                setError(null)
                const reader = new FileReader()
                reader.onloadend = () => setImagePreview(reader.result as string)
                reader.readAsDataURL(file)
            } else {
                setError("Image must be less than 5MB.")
                setImageFile(null)
                setImagePreview(null)
            }
        } else {
            setImageFile(null)
            setImagePreview(null)
            setError(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        const trimmedTitle = title.trim()
        const trimmedVenue = venue.trim()
        const trimmedCostType = costType.trim()
        const trimmedDescription = description.trim()

        if (!trimmedTitle || trimmedTitle.length > 50) {
            setError("Title is required and must be under 50 characters.")
            return
        }
        if (!trimmedVenue || trimmedVenue.length > 150) {
            setError("Venue is required and must be under 150 characters.")
            return
        }
        if (!startDate || !endDate || !startTime || !endTime || !trimmedCostType) {
            setError("All fields are required.")
            return
        }

        const startDateTime = new Date(`${startDate}T${startTime}`)
        const endDateTime = new Date(`${endDate}T${endTime}`)

        if (startDateTime.toString() === "Invalid Date" || endDateTime.toString() === "Invalid Date") {
            setError("Invalid date or time format.")
            return
        } else if (startDateTime >= endDateTime) {
            setError("Start date/time must be before end date/time.")
            return
        }

        if (!imageFile) {
            setError("Event image is required.")
            return
        }

        const reader = new FileReader()
        reader.onloadend = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setError("Unauthorized: Please login first.")
                    return
                }

                const res = await fetch("http://localhost:8000/api/admin/create-event/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: trimmedTitle,
                        venue: trimmedVenue,
                        start_date: startDate,
                        end_date: endDate,
                        start_time: startTime,
                        end_time: endTime,
                        cost_type: trimmedCostType,
                        description: trimmedDescription,
                        image: reader.result as string,
                    }),
                })

                if (!res.ok) {
                    const errorData = await res.json()
                    throw new Error(errorData.detail || "Event creation failed.")
                }

                setSuccess("Event created successfully!")
                // Clear form fields
                setTitle("")
                setVenue("")
                setStartDate("")
                setEndDate("")
                setStartTime("")
                setEndTime("")
                setCostType("")
                setDescription("")
                setImageFile(null)
                setImagePreview(null)

                setTimeout(() => navigate("/admin/dashboard"), 1500)
            } catch (err: any) {
                setError(err.message || "Event creation failed.")
            }
        }
        reader.readAsDataURL(imageFile)
    }

    const isSubmitDisabled =
        !title || !venue || !startDate || !endDate || !startTime || !endTime || !costType || !imageFile || loading

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 bg-purple-600 text-white text-center">
                    <h1 className="text-2xl font-bold">Event Hive</h1>
                </div>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-center">Create Event</h2>
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
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Event Title
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Enter event title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                                Event Venue
                            </label>
                            <input
                                id="venue"
                                type="text"
                                placeholder="Enter venue address"
                                value={venue}
                                onChange={(e) => setVenue(e.target.value)}
                                className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    id="startDate"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    id="endDate"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    End Time
                                </label>
                                <input
                                    id="endTime"
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="costType" className="block text-sm font-medium text-gray-700 mb-1">
                                Event Cost
                            </label>
                            <input
                                id="costType"
                                type="text"
                                placeholder="Enter the cost of the event (e.g., Free / 200 INR)"
                                value={costType}
                                onChange={(e) => setCostType(e.target.value)}
                                className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
                                Event Image
                            </label>
                            <div className="bg-gray-50 border border-gray-200 rounded-md h-48 flex items-center justify-center relative overflow-hidden">
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png, image/jpg"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    id="image-upload"
                                    required
                                />
                                {imagePreview ? (
                                    <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Event Preview"
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center text-gray-500">
                                        <Upload className="h-10 w-10 mb-2" />
                                        <p>Upload Here</p>
                                    </label>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Event Description
                            </label>
                            <textarea
                                id="description"
                                placeholder="Type here..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-50 rounded-md border border-gray-200 px-3 py-2 min-h-[100px] focus:ring-purple-500 focus:border-purple-500"
                            ></textarea>
                            <button
                                type="button"
                                onClick={generateDescription}
                                disabled={loading}
                                className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Generating..." : "AI Generate Description"}
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitDisabled}
                        >
                            Create Event
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AdminCreateEvent
