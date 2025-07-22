import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name.match(/^[A-Za-z ]+$/)) {
            setError('Name should contain only alphabetic characters and spaces.');
            return;
        }

        const processedEmail = email.trim().toLowerCase();
        if (!processedEmail.match(/^\S+@\S+\.\S+$/)) {
            setError('Invalid email format.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/api/admin/register/", {
                name,
                email: processedEmail,
                password,
            });
            setSuccess('Registered successfully!');
            localStorage.setItem('token', res.data.token);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Redirect to login page after successful registration
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const checkPasswordStrength = (password: string) => {
        let strength = 'Weak';
        if (password.length >= 8) strength = 'Medium';
        if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) strength = 'Strong';
        setPasswordStrength(strength);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!value.match(/^[A-Za-z ]*$/)) {
            setError('Name should contain only alphabetic characters and spaces.');
        } else {
            setError('');
        }
        setName(value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value.trim().toLowerCase());
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="text-center mb-8">
                    <h1 className="text-black font-bold mb-2 text-lg">Event <span className='text-lg text-purple-500'>Hive</span></h1>
                    <h2 className="text-2xl font-bold">Sign In to Event Hive</h2>
                </div>
                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                {success && <div className="text-green-500 mb-4 text-center">{success}</div>}
                <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full">
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            YOUR NAME
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={handleNameChange}
                            className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            YOUR EMAIL
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={handleEmailChange}
                            className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            PASSWORD
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                checkPasswordStrength(e.target.value);
                            }}
                            className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-purple-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 flex items-center pt-6 pr-3"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.693-9.5-6.375a1.005 1.005 0 010-.303C3.732 7.693 7.522 5 12 5c4.478 0 8.268 2.693 9.5 6.375a1.005 1.005 0 010 .303C20.268 16.307 16.478 19 12 19a7.97 7.97 0 00-1.625-1.175zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                        <div className="text-sm text-gray-600 mt-1">Password Strength: {passwordStrength}</div>
                    </div>
                    <div className="mb-8 relative">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                            CONFIRM PASSWORD
                        </label>
                        <input
                            id="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border-b border-gray-300 focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition duration-200"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;
