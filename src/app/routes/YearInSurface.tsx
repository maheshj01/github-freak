import { motion } from "framer-motion";
import { useTheme } from "../context/AppThemeProvider";


// Animated blob component
const AnimatedBlob = ({
    className,
    delay = 0,
    duration = 20,
    color
}: {
    className?: string;
    delay?: number;
    duration?: number;
    color: string;
}) => (
    <motion.div
        className={`absolute rounded-full blur-3xl opacity-60 ${className}`}
        style={{ background: color }}
        animate={{
            scale: [1, 1.2, 1.1, 1.3, 1],
            x: [0, 30, -20, 25, 0],
            y: [0, -40, 20, -30, 0],
            rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
        }}
    />
);
export default function YearInSurface() {
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    return (
        <div className="absolute inset-0 overflow-hidden">
            {/* Primary blobs */}
            <AnimatedBlob
                color={isDark ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : 'linear-gradient(135deg, #a5b4fc 0%, #c4b5fd 100%)'}
                className="w-[500px] h-[500px] -top-20 -left-20"
                delay={0}
                duration={25}
            />
            <AnimatedBlob
                color={isDark ? 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)' : 'linear-gradient(135deg, #fbcfe8 0%, #fecdd3 100%)'}
                className="w-[600px] h-[600px] top-1/4 -right-32"
                delay={2}
                duration={30}
            />
            <AnimatedBlob
                color={isDark ? 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)' : 'linear-gradient(135deg, #99f6e4 0%, #a5f3fc 100%)'}
                className="w-[450px] h-[450px] bottom-20 left-1/4"
                delay={4}
                duration={22}
            />
            <AnimatedBlob
                color={isDark ? 'linear-gradient(135deg, #f59e0b 0%, #eab308 100%)' : 'linear-gradient(135deg, #fde68a 0%, #fef08a 100%)'}
                className="w-[350px] h-[350px] top-1/2 left-10"
                delay={1}
                duration={28}
            />
            <AnimatedBlob
                color={isDark ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : 'linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)'}
                className="w-[400px] h-[400px] bottom-10 right-20"
                delay={3}
                duration={24}
            />

            {/* Glass overlay */}
            <div className={`absolute inset-0 ${isDark ? 'bg-gray-950/40' : 'bg-white/30'} backdrop-blur-sm`} />
        </div>
    );
}