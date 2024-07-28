"use client";
import { useState } from 'react';
import { Input } from "./_components/input";
import { motion } from 'framer-motion';

export default function Home() {
  const [username, setUsername] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username) {
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div
        className={`flex flex-col items-center justify-center ${hasSearched ? 'h-40' : 'h-screen'}`}
        animate={{ height: hasSearched ? '10rem' : '100vh' }}
        transition={{ duration: 0.5 }}
      >
        <form onSubmit={handleSearch} className="w-full max-w-md px-4">
          <Input
            placeholder="Enter your username"
            className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </form>
      </motion.div>

      {hasSearched && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <h2 className="text-2xl font-bold mb-4">GitHub Stats for {username}</h2>
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
    </div>
  );
}