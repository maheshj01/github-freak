import React from "react";


interface AnimatedButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
}

const AnimatedButton = ({ children, onClick }: AnimatedButtonProps) => {
    return (
        <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-[length:200%] animate-gradient-spin blur-md"></div>
            <button
                onClick={onClick}
                className="relative px-6 py-3 font-semibold text-white bg-gray-900 rounded-full border border-transparent group-hover:bg-opacity-90">
                {children}
            </button>
        </div>
    );
};

export default AnimatedButton;
