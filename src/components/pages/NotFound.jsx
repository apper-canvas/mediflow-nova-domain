import { Link } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-gray-900">
            Page Not Found
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist in our healthcare management system.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ApperIcon name="Home" size={18} />
            Back to Dashboard
          </Link>
          
          <Link 
            to="/patients" 
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ApperIcon name="Users" size={18} />
            View Patients
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact your system administrator.</p>
        </div>
      </div>
    </div>
  )
}

export default NotFound