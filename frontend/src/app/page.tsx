// src/app/page.tsx or Home.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 to-white overflow-hidden">
      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            Welcome to <span className="text-gray-800">E-Commerce Hub</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your one-stop platform for shopping, managing products, and handling orders.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md">
                User Login
              </button>
            </Link>

            <Link href="/admin">
              <button className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md">
                Admin Panel
              </button>
            </Link>

            <Link href="/register">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-300 shadow-md">
                Register
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-4">
        Built with <span className="text-blue-600 font-medium">Next.js</span>,{' '}
        <span className="text-purple-600 font-medium">NestJS</span>, and{' '}
        <span className="text-green-600 font-medium">Tailwind CSS</span> © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
