import React, { useEffect, useState } from "react";

interface TopLanguagesProp {
    username: string;
}

interface Repository {
    id: number;
    name: string;
    language: string | null;
}

interface LanguageCount {
    [key: string]: number;
}

export default function TopLanguages({ username }: TopLanguagesProp) {
    const [languages, setLanguages] = useState<LanguageCount>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchTopLanguages(uname: string) {
        const token = process.env.REACT_APP_GITHUB_TOKEN;

        try {
            const response = await fetch(`${process.env.REACT_APP_GITHUB_USER_API}/${uname}/repos`, {
                headers: {
                    'Authorization': `Basic ${btoa(token + ':x-oauth-basic')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user repositories');
            }

            const repos: Repository[] = await response.json();
            const langCount: LanguageCount = {};

            repos.forEach(repo => {
                if (repo.language) {
                    langCount[repo.language] = (langCount[repo.language] || 0) + 1;
                }
            });

            setLanguages(langCount);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (username) {
            fetchTopLanguages(username);
        }
    }, [username]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const sortedLanguages = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);  // Get top 5 languages
    // .filter(([, count]) => count > 0);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Top Languages</h2>
            <p className="mb-4">Most used languages in {username}'s repositories:</p>
            <ul className="space-y-2">
                {sortedLanguages.map(([lang, count]) => (
                    <li key={lang} className="flex items-center">
                        <span className="w-24 font-semibold">{lang}:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                                className="bg-blue-600 rounded-full h-4"
                                style={{ width: `${(count / Object.values(languages).reduce((a, b) => a + b, 0)) * 100}%` }}
                            ></div>
                        </div>
                        <span className="ml-2">{count}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}