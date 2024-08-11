import { useState, useEffect } from 'react';

export const useGitHubUser = (username: string) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const token = process.env.REACT_APP_GITHUB_TOKEN;
                const response = await fetch(`${process.env.REACT_APP_GITHUB_USER_API}/${username}`, {
                    headers: {
                        'Authorization': `Basic ${btoa(token + ':x-oauth-basic')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await response.json();
                setUser(userData);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUser();
        }
    }, [username]);

    return { user, loading, error };
};