
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md text-center">
        <div className="flex items-center justify-center text-yellow-500 mb-4">
          <AlertTriangle className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-lg text-gray-600 mb-6">Page Not Found</p>
        <p className="text-sm text-gray-500 mb-6">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
