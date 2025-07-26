'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-100 to-white overflow-hidden">
      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-4xl w-full bg-white shadow-xl rounded-2xl p-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
            Welcome to <span className="text-gray-800">E-Commerce Hub</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your one-stop platform for shopping, managing products, and handling orders. Built with modern technologies for a seamless and secure experience.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-12">
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

          {/* Project Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <p className="text-gray-600 col-span-1 md:col-span-2 mb-4">
              This application is professionally crafted using <strong>Next.js</strong> for a dynamic frontend, <strong>NestJS</strong> for a robust backend, <strong>PostgreSQL</strong> with Prisma ORM for secure data management, and <strong>Tailwind CSS</strong> for responsive styling.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Image
                  src="/nextjs-icon.svg"
                  alt="Next.js Icon"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <h2 className="text-2xl font-semibold text-gray-800">Frontend: Next.js</h2>
              </div>
              <p className="text-gray-600">
                The frontend is powered by <strong>Next.js</strong>, a React framework that delivers
                server-side rendering, static site generation, and a seamless developer experience.
                With Tailwind CSS, the UI is responsive, modern, and highly customizable, ensuring a
                delightful user experience across devices.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Image
                  src="/nestjs-icon.svg"
                  alt="NestJS Icon"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <h2 className="text-2xl font-semibold text-gray-800">Backend: NestJS</h2>
              </div>
              <p className="text-gray-600">
                The backend is built with <strong>NestJS</strong>, a progressive Node.js framework that
                provides a robust, scalable architecture. It handles authentication and user management
                through RESTful APIs, ensuring secure and efficient communication with the frontend.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Image
                  src="/postgresql-icon.svg"
                  alt="PostgreSQL Icon"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <h2 className="text-2xl font-semibold text-gray-800">Database: PostgreSQL</h2>
              </div>
              <p className="text-gray-600">
                User data is securely stored in <strong>PostgreSQL</strong>, a powerful open-source
                relational database. Managed with Prisma ORM, it ensures efficient data operations and
                seamless integration with the NestJS backend.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <svg
                  className="w-10 h-10 text-blue-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-800">APIs: POST, GET, UPDATE & DELETE</h2>
              </div>
              <p className="text-gray-600">
                The app uses <strong>RESTful APIs</strong> with POST, GET, UPDATE, and DELETE methods for secure user registration, login, data retrieval, and management, powered by Axios for reliable frontend-backend communication.
              </p>
            </div>
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