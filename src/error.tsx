import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
interface ErrorRouteProps {
    message?: string;
}

const ErrorRoute: React.FC<ErrorRouteProps> = ({ message }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Uh Oh! You've lost the track! </h1>
            <FaGithub className="text-6xl text-black" />
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={() => navigate('/')}
                className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
                Go Home
            </button>
        </div>
    );
};

export default ErrorRoute;