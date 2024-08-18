import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AutoscrollingTopRepos = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTopRepos = async () => {
            try {
                const response = await fetch(
                    process.env.REACT_APP_TOP_REPOSITORIES_API!
                );
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setRepos(data.items);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTopRepos();
    }, []);

    if (loading) return null;
    if (error) return null;

    return (
        <div className="fixed z-10 mt-20 overflow-hidden pointer-events-none h-2/4 p-8 justify-center">
            <motion.div
                className="flex flex-col space-y-4 py-20"
                animate={{
                    y: [0, -5000],
                }}
                transition={{
                    y: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 250,
                        ease: "linear",
                    },
                }}
            >
                {repos.map((repo: any) => (
                    <div key={repo.id} className="text-black  text-opacity-40 dark:text-opacity-30 text-sm">
                        {repo.name} - ⭐ {repo.stargazers_count.toLocaleString()}
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default AutoscrollingTopRepos;