"use client"
import { Linkedin, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#10107B] text-white py-12 px-4 md:px-8 rounded-t-xl">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Logo */}
        <div className="flex items-baseline gap-1 mb-8">
          <h2 className="text-3xl font-bold">Event</h2>
          <span className="text-3xl font-bold text-purple-400">Hive</span>
        </div>

        {/* Email Subscription */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your mail"
            className="flex-grow p-3 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button className="px-6 py-3 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-colors shadow-md">
            Subscribe
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12 text-lg font-medium">
          <a href="#" className="hover:text-purple-400 transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            About
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            Services
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            Get in touch
          </a>
          <a href="#" className="hover:text-purple-400 transition-colors">
            FAQs
          </a>
        </nav>

        {/* Separator Line */}
        <hr className="border-t border-purple-700 w-full max-w-4xl mb-8" />

        {/* Bottom Section: Language, Social, Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-4xl gap-6">
          {/* Language Selection */}
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold hover:bg-purple-700 transition-colors">
              English
            </button>
            <button className="px-4 py-2 text-gray-300 rounded-full text-sm font-semibold hover:text-purple-400 transition-colors">
              French
            </button>
            <button className="px-4 py-2 text-gray-300 rounded-full text-sm font-semibold hover:text-purple-400 transition-colors">
              Hindi
            </button>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            <a href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-purple-400 transition-colors">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-300 hover:text-purple-400 transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Facebook" className="text-gray-300 hover:text-purple-400 transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-300">Non Copyrighted &reg; 2023 Upload by EventHive</p>
        </div>
      </div>
    </footer>
  )
}
