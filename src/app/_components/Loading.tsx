import { motion } from "framer-motion";

export default function Loading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="container mx-auto px-4 py-4"
        >
            <div className="flex items-center justify-center h-3/4">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        </motion.div>
    );
}