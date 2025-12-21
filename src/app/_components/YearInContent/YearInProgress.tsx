import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getCurrentStatType, getTotalSlides, useYearInGithubStore } from "../../store/yearInGithubStore";

interface YearInProgressProps {
    onNext: () => void;
    onPrevious: () => void;
}

const NavigationButton: React.FC<{ onClick: () => void; disabled: boolean; icon: React.ReactNode }> = ({
    onClick,
    disabled,
    icon
}) => (
    <motion.button
        onClick={onClick}
        disabled={disabled}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${disabled
            ? 'bg-white/10 text-white/30 cursor-not-allowed'
            : 'bg-white/20 text-white hover:bg-white/30'
            }`}
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
    >
        {icon}
    </motion.button>
);

const YearInProgress: React.FC<YearInProgressProps> = ({ onNext, onPrevious }) => {
    const { currentIndex, next, previous, stats } = useYearInGithubStore();
    const currentStatType = getCurrentStatType(currentIndex);
    const totalSlides = getTotalSlides();
    const isIntro = currentStatType === 'intro';
    const isLast = currentIndex === totalSlides - 1;
    return (
        (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-6 mb-8"
            >
                <NavigationButton
                    onClick={onPrevious}
                    disabled={currentIndex <= 1}
                    icon={<FaChevronLeft color="black" />}
                />

                {/* Progress dots */}
                <div className="flex gap-2">
                    {[...Array(totalSlides - 1)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex - 1
                                ? 'bg-black w-6'
                                : 'bg-white/30'
                                }`}
                        />
                    ))}
                </div>

                <NavigationButton
                    onClick={next}
                    disabled={isLast}
                    icon={<FaChevronRight color="black" />}
                />
            </motion.div>
        )
    );
};


export default YearInProgress;