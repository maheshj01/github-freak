import { create } from 'zustand';

export enum YearStatType {
    intro = 'intro',
    totalCommits = 'totalCommits',
    totalPRs = 'totalPRs',
    activeDays = 'activeDays',
    longestStreak = 'longestStreak',
    mostActiveDay = 'mostActiveDay',
    topLanguage = 'topLanguage',
    summary = 'summary',
}

export interface YearStats {
    totalCommits: number;
    totalPRs: number;
    activeDays: number;
    longestStreak: number;
    mostActiveDay: string;
    topLanguage: string;
}

export interface GitHubUser {
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

interface YearInGithubState {
    // Navigation
    currentIndex: number;
    direction: 'forward' | 'backward';
    username: string;
    // Stats data
    stats: YearStats;
    isLoading: boolean;
    githubRawData: any;
    user: GitHubUser | null;

    // Actions
    setUsername: (username: string) => void;
    next: () => void;
    previous: () => void;
    goToSlide: (index: number) => void;
    setStats: (stats: YearStats) => void;
    setLoading: (loading: boolean) => void;
    reset: () => void;
    setGithubRawData: (data: any) => void;
    setUser: (user: GitHubUser | null) => void;
}

const statOrder: YearStatType[] = [
    YearStatType.intro,
    YearStatType.totalCommits,
    YearStatType.totalPRs,
    YearStatType.activeDays,
    YearStatType.longestStreak,
    YearStatType.mostActiveDay,
    YearStatType.topLanguage,
    YearStatType.summary,
];

const defaultStats: YearStats = {
    totalCommits: 0,
    totalPRs: 0,
    activeDays: 0,
    longestStreak: 0,
    mostActiveDay: 'Monday',
    topLanguage: 'TypeScript',
};

export const useYearInGithubStore = create<YearInGithubState>((set, get) => ({
    // Initial state
    username: '',
    currentIndex: 0,
    direction: 'forward',
    stats: defaultStats,
    githubRawData: null,
    isLoading: false,
    user: null,

    // Navigation actions
    next: () => {
        const { currentIndex } = get();
        if (currentIndex < statOrder.length - 1) {
            set({
                currentIndex: currentIndex + 1,
                direction: 'forward'
            });
        }
    },

    previous: () => {
        const { currentIndex } = get();
        if (currentIndex > 0) {
            set({
                currentIndex: currentIndex - 1,
                direction: 'backward'
            });
        }
    },

    goToSlide: (index: number) => {
        const { currentIndex } = get();
        if (index >= 0 && index < statOrder.length) {
            set({
                currentIndex: index,
                direction: index > currentIndex ? 'forward' : 'backward'
            });
        }
    },

    // Data actions
    setStats: (stats: YearStats) => set({ stats }),
    setLoading: (isLoading: boolean) => set({ isLoading }),

    reset: () => set({
        currentIndex: 0,
        direction: 'forward',
        stats: defaultStats,
        isLoading: false,
        githubRawData: null,
        username: '',
        user: null,
    }),
    setUsername: (username: string) => set({ username }),
    setGithubRawData: (data: any) => set({ githubRawData: data }),
    setUser: (user: GitHubUser | null) => set({ user }),
}));

// Helper to get current stat type
export const getCurrentStatType = (index: number): YearStatType => {
    return statOrder[index] || 'intro';
};

export const getStatOrder = () => statOrder;
export const getTotalSlides = () => statOrder.length;
