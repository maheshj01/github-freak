import { useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { Input } from '../_components/input';
import React from 'react';
import { useTheme } from '../context/AppThemeProvider';
import { motion } from 'framer-motion';

export default function App() {
  const [searchValue, setSearchValue] = React.useState('');
  const { theme } = useTheme();
  const [hasSearched, setHasSearched] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue) {
      setHasSearched(true);
      // Wait for the animation to complete before navigating
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = `/${searchValue}`;
    }
  };

  const ThemeDebug = () => {
    return (
      <div className="fixed bottom-4 left-4 bg-white text-black p-2 rounded">
        Current Theme: {theme.name}-{theme.mode}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient ${theme.mode === 'dark' ? 'theme-aqua-dark' : 'theme-aqua-light'}`}>
      <motion.div
        className="flex flex-col items-center justify-center h-screen"
        animate={{
          height: hasSearched ? '20vh' : '100vh',
          transition: { duration: 0.5 }
        }}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
          <div className="flex items-center justify-center mb-4">
            <FaGithub className="text-6xl" />
            <p className='text-2xl mx-6'> Hello Freaks!</p>
          </div>{/* <ThemeDebug /> */}
          <Input
            placeholder="Enter a GitHub username"
            className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchValue}
            onChange={handleInputChange}
          />
        </form>
      </motion.div>
    </div>
  );
}