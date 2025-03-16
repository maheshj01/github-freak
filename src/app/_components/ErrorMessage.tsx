import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from "react-icons/fa";

interface ErrorMessageProps {
    username: string;
    message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ username, message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 rounded-lg bg-red-50 dark:bg-red-900/20"
        >
            <FaExclamationCircle className="text-6xl text-red-500 dark:text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">User Not Found</h2>
            <p className="text-red-600 dark:text-red-200 text-center">
                {message || `We couldn't find a GitHub user with the username "${username}". Please check the spelling and try again.`}
            </p>
        </motion.div>
    );
};

export default ErrorMessage; 