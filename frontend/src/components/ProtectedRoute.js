import { useSelector } from "react-redux"
import { Outlet, Navigate} from "react-router-dom";

const ProtectedRoute = () => {
    const {userInfo} = useSelector((state) => state.authSlice);
    return userInfo ? <Outlet/> : <Navigate to='/login-user' replace />;
}

export default ProtectedRoute;