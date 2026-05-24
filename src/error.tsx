import { motion } from 'framer-motion';
import React from 'react';
import { FaGithub, FaHome } from "react-icons/fa";
import { useNavigate, useRouteError } from 'react-router-dom';

interface ErrorRouteProps {
    message?: string;
}

// Animated floating particles
const FloatingParticle = ({ delay, size, left, duration }: { delay: number; size: number; left: string; duration: number }) => (
    <motion.div
        className="absolute rounded-full bg-gradient-to-br from-violet-500/20 to-pink-500/20"
        style={{ width: size, height: size, left }}
        initial={{ y: '100vh', opacity: 0 }}
        animate={{ y: '-100px', opacity: [0, 1, 1, 0] }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "linear",
        }}
    />
);

const ErrorRoute: React.FC<ErrorRouteProps> = ({ message }) => {
    const navigate = useNavigate();
    const error = useRouteError() as { statusText?: string; message?: string; status?: number };

    // const errorMessage = message || error?.statusText || error?.message || "Page not found";
    const errorCode = error?.status || 404;

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient orbs */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-violet-600/30 to-purple-600/30 blur-3xl"
                    style={{ top: '-200px', right: '-200px' }}
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-pink-600/20 to-rose-600/20 blur-3xl"
                    style={{ bottom: '-150px', left: '-150px' }}
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [360, 180, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                    <FloatingParticle
                        key={i}
                        delay={i * 2}
                        size={Math.random() * 20 + 10}
                        left={`${Math.random() * 100}%`}
                        duration={Math.random() * 10 + 15}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
                {/* Error Icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-8"
                >
                    <div className="relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 blur-xl opacity-50"
                        />
                        <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-full border border-white/10">
                            <FaGithub className="text-7xl text-white" />
                        </div>
                    </div>
                </motion.div>

                {/* Error Code */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-8xl md:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-pink-400 to-cyan-400 mb-4"
                >
                    {errorCode}
                </motion.h1>

                {/* Error Title */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl md:text-3xl font-bold text-white mb-8 text-center flex items-center gap-3"
                >
                    Oops! You've lost the track!
                </motion.h2>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <motion.button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-violet-500/25 transition-all duration-300 rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaHome className="text-xl group-hover:scale-110 transition-transform" />
                        Go Home
                    </motion.button>

                </motion.div>

                {/* Helpful Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="mt-12 text-center"
                >
                    <p className="text-gray-500 mb-3">Looking for something specific?</p>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <button
                            onClick={() => navigate('/')}
                            className="text-violet-400 hover:text-violet-300 underline underline-offset-4 transition-colors"
                        >
                            Search GitHub Users
                        </button>
                        <span className="text-gray-600">•</span>
                        <button
                            onClick={() => navigate(`/year/${new Date().getFullYear()}`)}
                            className="text-pink-400 hover:text-pink-300 underline underline-offset-4 transition-colors"
                        >
                            Year in GitHub
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ErrorRoute;