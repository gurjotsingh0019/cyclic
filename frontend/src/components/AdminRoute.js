import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
    const {userInfo} = useSelector((state) => state.authSlice);
    return userInfo && userInfo?.role === 'admin' ? <Outlet /> : <Navigate to='/login-user' replace />;
};
export default AdminRoute;