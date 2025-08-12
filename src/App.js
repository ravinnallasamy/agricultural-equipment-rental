/**
 * Main Application Component - Agricultural Equipment Rental Platform
 *
 * This is the central routing component that manages navigation between different
 * sections of our rental platform. It handles both user and provider interfaces,
 * ensuring proper access control and user experience.
 *
 * Key Features:
 * - Dual interface support (Users and Providers)
 * - Secure authentication routing
 * - Profile management
 * - Equipment catalog and rental management
 *
 * Author: Development Team
 * Purpose: Educational project demonstrating full-stack development
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginControl from './frontend/login/LoginControl';
import UserLoginControl from './frontend/login/UserLoginControl';
import SourceProviderLoginControl from './frontend/login/SourceProviderLoginControl';
import Signin from './frontend/login/Signin';
import Signup from './frontend/login/signup';
import PHome from './frontend/Provider-Home/PHome';
import CHome from './frontend/Customer-Home/CHome';
import Profile from './frontend/profile/Profile';
import Add from './frontend/Provider-Home/pages/Add';
import MyCatalog from './frontend/Provider-Home/pages/My_Catalog';
import MyRentalRequest from './frontend/Provider-Home/pages/My_Rental_Request';
import NoMatch from './frontend/NoMatch';
import Logout from './frontend/Logout/Logout';
import Requests from './frontend/Customer-Home/Requests/Requests';
import MyRequest from './frontend/Customer-Home/Requests/MyRequest';
import ActivationSuccess from './frontend/activation/ActivationSuccess';
import ActivationPage from './frontend/activation/ActivationPage';

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/user" element={<UserLoginControl />} />
      <Route path="/user-home" element={<CHome />} />
      <Route path="/user/request-item" element={<Requests />} />
      <Route path="/user/My-Request" element={<MyRequest />} />

      {/* Provider routes */}
      <Route path="/provider" element={<SourceProviderLoginControl />} />
      <Route path="/provider-home" element={<PHome />} />
      <Route path="/provider/requests" element={<MyRentalRequest />} />
      <Route path="/provider/add-equipment" element={<Add />} />
      <Route path="/provider/my-catalog" element={<MyCatalog/>} />

      {/* Common Routes */}
      <Route path="/" element={<LoginControl />} />
      <Route path="/signin/:userType" element={<Signin/>} />
      <Route path="/signup/:userType" element={<Signup />} />
      <Route path="/profile/:userType/:id" element={<Profile />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/activate/:token" element={<ActivationPage />} />
      <Route path="/activation-success" element={<ActivationSuccess />} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default App;