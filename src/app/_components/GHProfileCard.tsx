import React from 'react';

interface GitHubUser {
    login: string;
    avatar_url: string;
    name: string;
    bio: string;
    location: string;
    blog: string;
    twitter_username: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

interface GHProfileCardProps {
    user: GitHubUser;
}

const GHProfileCard: React.FC<GHProfileCardProps> = ({ user }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
                <div className="flex items-center">
                    <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                    <div className="ml-4">
                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                        <p className="text-white opacity-90">@{user.login}</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <p className="text-gray-700 mb-4">{user.bio}</p>
                <div className="flex flex-wrap -mx-2 mb-4">
                    {user.location && (
                        <div className="px-2 mb-2">
                            <span className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                📍 {user.location}
                            </span>
                        </div>
                    )}
                    {user.blog && (
                        <div className="px-2 mb-2">
                            <a href={user.blog} target="_blank" rel="noopener noreferrer" className="bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-700 hover:bg-blue-200">
                                🌐 Website
                            </a>
                        </div>
                    )}
                    {user.twitter_username && (
                        <div className="px-2 mb-2">
                            <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noopener noreferrer" className="bg-blue-400 rounded-full px-3 py-1 text-sm font-semibold text-white hover:bg-blue-500">
                                🐦 Twitter
                            </a>
                        </div>
                    )}
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                    <div>
                        <span className="font-bold">{user.public_repos}</span> repositories
                    </div>
                    <div>
                        <span className="font-bold">{user.followers}</span> followers
                    </div>
                    <div>
                        <span className="font-bold">{user.following}</span> following
                    </div>
                </div>
                <div className="text-xs text-gray-500">
                    Joined GitHub on {formatDate(user.created_at)}
                </div>
            </div>
        </div>
    );
};

export default GHProfileCard;