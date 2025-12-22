import { useEffect, useState } from 'react';
import { GitHubUser, useYearInGithubStore } from '../store/yearInGithubStore';

export const useGitHubUser = (username: string) => {
    const { user: cachedUser, setUser } = useYearInGithubStore();
    const [user, setLocalUser] = useState<GitHubUser | null>(cachedUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        // If we already have the user cached for this username, use it
        if (cachedUser && cachedUser.login?.toLowerCase() === username?.toLowerCase()) {
            setLocalUser(cachedUser);
            return;
        }

        const fetchUser = async () => {
            if (!username) return;

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

                const userData: GitHubUser = await response.json();
                setLocalUser(userData);
                setUser(userData);
                setError(null);
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchUser();
        }
    }, [username, cachedUser, setUser]);

    return { user, loading, error };
};