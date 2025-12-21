import { motion } from "framer-motion";
import React from "react";

interface AnimatedButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    disabled?: boolean;
}

const AnimatedButton = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false
}: AnimatedButtonProps) => {

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    const variantClasses = {
        primary: 'bg-gray-900 text-white hover:bg-gray-800',
        secondary: 'bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20',
        ghost: 'bg-transparent text-white hover:bg-white/10',
    };

    return (
        <motion.div
            className="relative group"
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
            {/* Animated gradient glow */}
            <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-70 blur-lg group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundSize: '200% 200%',
                }}
            />

            {/* Sparkle effect on hover */}
            <motion.div
                className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{
                            x: '50%',
                            y: '50%',
                            opacity: 0
                        }}
                        animate={{
                            x: ['50%', `${20 + i * 30}%`, `${80 - i * 20}%`, '50%'],
                            y: ['50%', `${20 + i * 20}%`, `${70 - i * 15}%`, '50%'],
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1.5, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            delay: i * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </motion.div>

            {/* Button */}
            <motion.button
                onClick={disabled ? undefined : onClick}
                disabled={disabled}
                className={`
                    relative 
                    ${sizeClasses[size]} 
                    font-semibold 
                    rounded-full 
                    ${variantClasses[variant]}
                    transition-all 
                    duration-300
                    shadow-lg
                    shadow-purple-500/20
                    hover:shadow-purple-500/40
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${className}
                `}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {children}
                </span>

                {/* Inner shine effect */}
                <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
            </motion.button>
        </motion.div>
    );
};

export default AnimatedButton;
