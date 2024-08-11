import { Button } from "./button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./tooltip";

type IconButtonProps = {
    onClick?: () => void;
    children: React.ReactNode;
    ariaLabel?: string;
    className?: string;
    tooltipPlacement?: "top-start" | "top" | "top-end" | "right-start" | "right" | "right-end" | "bottom-start" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end";
};

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, ariaLabel, className, tooltipPlacement }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        aria-label={ariaLabel}
                        className={`bg-transparent hover:bg-pink-400 rounded-full p-2 dark:text-white ${className}`}
                        onClick={onClick}
                        size='lg'>
                        {children}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{ariaLabel}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default IconButton;