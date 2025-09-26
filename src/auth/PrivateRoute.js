import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, roles = [] }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const location = useLocation();

  const getUserRoles = () => {
    if (!userInfo) return [];
    
    const userRoles = [];
    if (userInfo.user?.is_superuser) userRoles.push('superadmin');
    if (userInfo.user?.is_staff) userRoles.push('admin');

    return userRoles;
  };

  const userRoles = getUserRoles();

  // Not logged in - redirect to login with return URL
  if (!userInfo) {
    return (
      <Navigate
        to={`/login`}
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  // Check if route requires specific roles
  if (roles.length > 0) {
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the children
  return children;
};

export default PrivateRoute;