import { useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { Input } from '../_components/input';
import React from 'react';


  export default function App() {
    const [searchReady, setSearchReady] = useState(false);
    const [searchValue, setSearchValue] = React.useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchValue) {
        window.location.href = `/${searchValue}`;
      }
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex flex-col items-center justify-center h-screen">
          <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
            <div className="flex items-center justify-center mb-4">
              <FaGithub className="text-6xl text-black" />
              <p className='text-2xl mx-6'> Hello Freaks!</p>
            </div>
            <Input
            placeholder="Enter a GitHub username"
            className="w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:outline-none focus:border-blue-500"
            value={searchValue}
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  );
}