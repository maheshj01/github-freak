import React from 'react';
import { motion } from 'framer-motion';
import { FaExclamationCircle } from "react-icons/fa";
import { useTheme } from '../context/AppThemeProvider';

interface ErrorMessageProps {
    username: string;
    message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ username, message }) => {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-8 ">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-red-600 '} mb-2`}>User Not Found</h2>
            <p className={`text-center ${isDark ? 'text-white' : 'text-red-600 '}`} >
                {message || `We couldn't find a GitHub user with the username "${username}".`}
            </p>
            <p className={`text-center ${isDark ? 'text-white' : 'text-red-600 '}`}> Please check the spelling and try again.</p>
        </motion.div >
    );
};

export default ErrorMessage; 