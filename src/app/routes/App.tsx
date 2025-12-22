import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaChevronRight, FaGithub } from "react-icons/fa";
import AnimatedButton from '../_components/AnimatedButton';
import { Input } from '../_components/input';
import AutoscrollingTopRepos from '../_components/top-repositories';
import { useTheme } from '../context/AppThemeProvider';
import Analytics from '../services/Analytics';

export default function App() {
  const [searchValue, setSearchValue] = React.useState('');
  const { theme } = useTheme();
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\s+/g, '');
    if (searchValue !== newValue) {
      setSearchValue(newValue);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue) {
      Analytics.logSearch(searchValue);
      setHasSearched(true);
      // Wait for the animation to complete before navigating
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = `/${searchValue}`;
    }
  };

  useEffect(() => {
    Analytics.logPageView('/', 'Home');
  }, []);

  const ThemeDebug = () => {
    return (
      <div className="fixed bottom-4 left-4 bg-white text-black p-2 rounded">
        Current Theme: {theme.name}-{theme.mode}
      </div>
    );
  };

  const currentYear = new Date().getFullYear();
  const isDark = theme.mode === 'dark';

  return (
    <div className={`min-h-screen bg-gradient ${theme.mode === 'dark' ? 'theme-aqua-dark' : 'theme-aqua-light'} z-50`}>
      <AutoscrollingTopRepos />
      <motion.div
        className="flex flex-col items-center justify-center h-screen z-10"
        animate={{
          height: hasSearched ? '20vh' : '100vh',
          transition: { duration: 0.5 }
        }}
      >

        <form onSubmit={handleSubmit} className="w-full max-w-md px-4 mt-48">
          <motion.div
            animate={{ scale: hasSearched ? 0.9 : 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-8">
            <FaGithub className="text-6xl" />
            <p className='text-2xl mx-6 font-mono'> Hello Freaks!</p>
          </motion.div>
          <Input
            placeholder="Enter your Github username"
            className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500 text-center max-w-[400px] text-lg font-semibold font-mono"
            value={searchValue}
            onChange={handleInputChange}
          />
        </form>
        <div className="mt-12" />
        {/* Year in GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Check out your year in review
          </p>

          <AnimatedButton onClick={() => {
            window.location.href = `/year/${currentYear}`;
          }}>
            <div className="flex items-center gap-2">
              <span>Year in GitHub {currentYear}</span>
              <FaChevronRight className="text-sm" />
            </div>
          </AnimatedButton>
        </motion.div>
      </motion.div>
    </div >
  );
}