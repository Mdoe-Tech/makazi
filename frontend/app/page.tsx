import Link from 'next/link';
import { FaUserShield, FaUserFriends, FaFileAlt, FaFingerprint } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <div className="flex flex-col items-center gap-4">
          {/* Logo Placeholder */}
          <div className="bg-blue-600 rounded-full p-4 shadow-lg mb-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="24" fill="#2563eb" />
              <path d="M24 14L34 22V34H14V22L24 14Z" fill="white" />
            </svg>
          </div>
          <h1 className="text-5xl font-extrabold text-blue-800 mb-2 text-center drop-shadow-sm">Welcome to Makazi</h1>
          <p className="text-xl text-gray-700 max-w-2xl text-center mb-6">
            The all-in-one platform for secure citizen management, document processing, and Nida verification. Empowering communities with technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/admin/login" className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-md hover:bg-blue-700 transition">
              Admin Login
            </Link>
            <Link href="/citizen/login" className="px-8 py-3 bg-green-600 text-white rounded-full font-semibold text-lg shadow-md hover:bg-green-700 transition">
              Citizen Login
            </Link>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <FaUserShield className="text-blue-600 text-4xl mb-3" />
          <h3 className="font-bold text-lg mb-1">Admin Dashboard</h3>
          <p className="text-gray-600 text-sm">Powerful tools for administrators to manage users, documents, and system settings.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <FaUserFriends className="text-green-600 text-4xl mb-3" />
          <h3 className="font-bold text-lg mb-1">Citizen Portal</h3>
          <p className="text-gray-600 text-sm">Easy access for citizens to view, update, and manage their personal information and documents.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <FaFileAlt className="text-yellow-500 text-4xl mb-3" />
          <h3 className="font-bold text-lg mb-1">Document Management</h3>
          <p className="text-gray-600 text-sm">Secure and efficient document processing, verification, and digital storage.</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
          <FaFingerprint className="text-purple-600 text-4xl mb-3" />
          <h3 className="font-bold text-lg mb-1">Biometric Security</h3>
          <p className="text-gray-600 text-sm">Advanced biometric verification for enhanced security and fraud prevention.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-gray-500 text-sm mt-auto">
        &copy; {new Date().getFullYear()} Makazi. All rights reserved.
      </footer>
    </div>
  );
}
