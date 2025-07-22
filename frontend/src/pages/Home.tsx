"use client"
import { useNavigate } from "react-router-dom"
import { CalendarCheck, Users, Sparkles } from "lucide-react" // Import Sparkles icon
import { useState, useEffect } from "react"

export default function HomePage() {
    const navigate = useNavigate()
    const phrases = [
        "Discover extraordinary Events",
        "Manage your next big gathering",
        "Connect with your audience",
        "Experience seamless event planning",
    ]
    const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
    const [displayedText, setDisplayedText] = useState("")
    const [isTyping, setIsTyping] = useState(true)
    const [charIndex, setCharIndex] = useState(0)
    const [iconKey, setIconKey] = useState(0) // Key to re-trigger icon animation

    useEffect(() => {
        let typingTimer: NodeJS.Timeout
        let deletingTimer: NodeJS.Timeout
        let phraseChangeTimer: NodeJS.Timeout

        if (isTyping) {
            if (charIndex < phrases[currentPhraseIndex].length) {
                typingTimer = setTimeout(() => {
                    setDisplayedText((prev) => prev + phrases[currentPhraseIndex][charIndex])
                    setCharIndex((prev) => prev + 1)
                }, 60) // Typing speed
            } else {
                setIsTyping(false)
                deletingTimer = setTimeout(() => setIsTyping(false), 1500) // Pause before deleting
            }
        } else {
            if (charIndex > 0) {
                deletingTimer = setTimeout(() => {
                    setDisplayedText((prev) => prev.slice(0, -1))
                    setCharIndex((prev) => prev - 1)
                }, 30) // Deleting speed
            } else {
                setIsTyping(true)
                setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
                setDisplayedText("")
                setIconKey((prev) => prev + 1) // Change key to re-trigger icon animation
            }
        }

        return () => {
            clearTimeout(typingTimer)
            clearTimeout(deletingTimer)
            clearTimeout(phraseChangeTimer)
        }
    }, [charIndex, isTyping, currentPhraseIndex, phrases])

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 sm:p-10 lg:p-12 max-w-4xl w-full text-center overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-xl" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-30 blur-xl" />

                <div className="relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                        Welcome to <span className="text-purple-700">Event Hive</span>
                    </h1>
                    <p className="mb-8 text-lg text-gray-700 max-w-md mx-auto">
                        Your ultimate platform for discovering and managing extraordinary events.
                    </p>

                    {/* Typing Animation Section with Icon */}
                    <div className="mb-10 h-20 flex items-center justify-center gap-2">
                        <Sparkles key={iconKey} className="h-8 w-8 text-purple-600 animate-scale-in-out" />
                        <p className="text-2xl sm:text-3xl font-bold text-gray-800 min-h-[3rem]">
                            {displayedText}
                            <span className="inline-block w-1 h-8 bg-purple-600 ml-1 animate-blink" />
                        </p>
                    </div>

                    <p className="mb-8 text-xl font-semibold text-gray-800">Please choose your login type to continue:</p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate("/login")}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white font-semibold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                        >
                            <CalendarCheck className="h-6 w-6" />
                            Admin Login
                        </button>
                        <button
                            onClick={() => navigate("/user/login")}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            <Users className="h-6 w-6" />
                            User Login
                        </button>
                    </div>
                </div>
            </div>
            {/* Add custom keyframes for animations */}
            <style >{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scale-in-out {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        .animate-blink {
          animation: blink 1s infinite step-end;
        }
        .animate-scale-in-out {
          animation: scale-in-out 1.5s ease-in-out infinite;
        }
      `}</style>
        </div>
    )
}
