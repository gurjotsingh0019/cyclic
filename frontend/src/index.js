import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeScreen from './components/screens/HomeScreen';
import SingleHouseDataScreen from './components/screens/SingleHouseDataScreen.js';
import store from './store';
import { Provider } from 'react-redux';
import LoginScreen from './components/screens/LoginScreen.js';
import RegisterScreen from './components/screens/RegisterScreen.js';
import ProtectedRoute from './components/ProtectedRoute.js'
import ProfileScreen from './components/screens/ProfileScreen.js';
import CartScreen from './components/screens/CartScreen.js';
import AdminRoute from './components/AdminRoute.js';
import GetAllUsersScreen from './components/adminScreen/GetAllUsersScreen.js';
import GetAllBookings from './components/adminScreen/GetAllBookings.js';
import CreateHouseScreen from './components/screens/CreateHouseScreen.js';
import UserActivity from './components/screens/UserActivity.js';
import MyListings from './components/screens/MyListings.js';
import GetAllListings from './components/adminScreen/GetAllListings.js';
import Bookings from './components/screens/Bookings.js';
import ShippingScreen from './components/screens/ShippingScreen.js';
import PlaceOrderScreen from './components/screens/PlaceOrderScreen.js';
import MyBookings from './components/screens/MyBookings.js';
import SingleUserDetail from './components/adminScreen/SingleUserDetail.js';
import UpdateListing from './components/screens/UpdateListing.js';
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeScreen />
      },
      {
        path: '/search',
        element: <HomeScreen />
      },
      {
        path: '/register-user',
        element: <RegisterScreen />
      },
      {
        path: '/login-user',
        element: <LoginScreen />
      },
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          {
            path: '/my-Information',
            element: <ProfileScreen />
          },
          {
            path: '/single-house-data/:id',
            element: <SingleHouseDataScreen />
          },
          {
            path: '/dwell-deck',
            element: <CartScreen />
          },
          {
            path: '/create-house',
            element: <CreateHouseScreen />
          },
          {
            path: '/my-activity',
            element: <UserActivity />
          },
          {
            path: '/my-listings',
            element: <MyListings />
          },
          {
            path: '/booking/:id',
            element: <Bookings />
          },
          {
            path: '/shipping',
            element: <ShippingScreen />
          },
          {
            path: '/place-my-bookings',
            element: <PlaceOrderScreen />
          },
          {
            path: '/my-bookings',
            element: <MyBookings />
          },
          {
            path: '/update-house/:id',
            element: <UpdateListing />
          }
        ]
      },
      {
        path: '',
        element: <AdminRoute />,
        children: [
          {
            path: '/admin/get-all-users',
            element: <GetAllUsersScreen />
          },
          {
            path: '/admin/all-bookings',
            element: <GetAllBookings />
          },
          {
            path: '/admin/all-listings',
            element: <GetAllListings />
          },
          {
            path: '/admin/user-details/:id',
            element: <SingleUserDetail />
          },
          {
            path: '/admin/update-house/:id',
            element: <UpdateListing />
          }
        ]
      }
    ]
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
