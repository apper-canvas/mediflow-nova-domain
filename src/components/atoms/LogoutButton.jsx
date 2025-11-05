import { useAuth } from '@/layouts/Root';
import { useSelector } from 'react-redux';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const LogoutButton = () => {
  const { logout } = useAuth();
  const { user, isAuthenticated } = useSelector(state => state.user);

  if (!isAuthenticated) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={logout}
      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 border-gray-300 hover:border-red-300"
    >
      <ApperIcon name="LogOut" className="w-4 h-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;