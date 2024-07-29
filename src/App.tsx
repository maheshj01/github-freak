"use client";
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub } from "react-icons/fa";
import { Input } from './app/_components/input';
import GHContribution from './app/_components/GHContribution';
import debounce from 'lodash/debounce';

export default function App() {
  const [username, setUsername] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [searchReady, setSearchReady] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  // const debouncedSearch = useCallback(
  //   debounce((searchTerm: string) => {
  //     if (searchTerm) {
  //       setHasSearched(true);
  //       setSearchReady(false);
  //       setTimeout(() => {
  //         setSearchReady(true);
  //       }, 1000);
  //     }
  //   }, 300),
  //   []
  // );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchValue(searchTerm);
    // setSearchReady(false);
    // if (hasSearched) {
    //   debouncedSearch(searchTerm);
    // }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue) {
      setUsername(searchValue);
      setHasSearched(true);
      setSearchReady(false);
      setTimeout(() => {
        setSearchReady(true);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        className={`flex flex-col items-center justify-center ${hasSearched ? 'h-40' : 'h-screen'}`}
        animate={{ height: hasSearched ? '10rem' : '100vh' }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
          <div className="flex items-center justify-center mb-4">
            <FaGithub className="text-6xl text-black" />
            <p className='text-2xl mx-6'> Hello Freaks!</p>
          </div>
          <Input
            placeholder="Enter your username"
            className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchValue}
            onChange={handleInputChange}
          />
        </form>
      </motion.div>

      {hasSearched && searchReady && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 py-4"
        >
          <h2 className="text-2xl font-bold mb-4">GitHub Stats for {username}</h2>
          <GHContribution
            username={username}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Commits</h3>
              <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                Dummy Commit Graph
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                Dummy Language Graph
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {!searchReady && hasSearched && (

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
      )}
    </div>
  );
}