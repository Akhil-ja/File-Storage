"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Navbar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await api.post('/auth/logout');
      if (response.data.success) {
        toast.success(response.data.message);
        router.push('/login');
      }
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast.error(error.response?.data?.message || 'Logout failed. Please try again.');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 text-white w-full">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold">
          Secure File Storage
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;