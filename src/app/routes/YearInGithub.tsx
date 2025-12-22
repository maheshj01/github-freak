import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/AppThemeProvider';
import YearInContent from './YearInContent';
import YearInSurface from './YearInSurface';
import { useYearInGithubStore } from '../store/yearInGithubStore';

export default function YearInGithub() {
    const { year, username } = useParams();
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    const selectedYear = year ? parseInt(year) : currentYear;
    const { theme } = useTheme();
    const isDark = theme.mode === 'dark';
    const { setUsername } = useYearInGithubStore();

    useEffect(() => {
        if (username) {
            setUsername(username);
        }
    }, [username]);

    // check if year is valid
    useEffect(() => {
        if (selectedYear < 2015 || selectedYear > currentYear) {
            navigate(`/year/${currentYear}/${username}`);
        }
    }, [selectedYear]);

    return (
        <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-gray-950' : 'bg-slate-50'}`}>
            <YearInSurface />
            <YearInContent selectedYear={selectedYear} />
        </div>
    );
}