'use client';

import { useAuth, useUser, useAppDispatch } from '../../redux/hooks';
import { loginUser, logoutUser, clearError } from '../../redux/features/auth/authSlice';
import { fetchUserProfile, updateUserProfile } from '../../redux/features/user/userSlice';
import { useState } from 'react';

export default function ReduxExample() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const { profile, isProfileUpdated } = useUser();
  
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(credentials));
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  const handleFetchProfile = async () => {
    if (user?.id) {
      await dispatch(fetchUserProfile(user.id));
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Redux Example</h2>
      
      {/* Auth Status */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Auth Status:</h3>
        <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Loading: {isLoading ? 'Yes' : 'No'}</p>
        {user && <p>User: {user.email}</p>}
        {error && (
          <div className="text-red-500">
            Error: {error}
            <button 
              onClick={handleClearError}
              className="ml-2 text-blue-500 underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Login Form */}
      {!isAuthenticated && (
        <form onSubmit={handleLogin} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Login:</h3>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full p-2 border rounded mb-2"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      )}

      {/* Logout Button */}
      {isAuthenticated && (
        <div className="mb-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}

      {/* User Profile */}
      {isAuthenticated && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold">User Profile:</h3>
          {profile ? (
            <div>
              <p>Name: {profile.name}</p>
              <p>Email: {profile.email}</p>
              {isProfileUpdated && <p className="text-green-500">Profile updated!</p>}
            </div>
          ) : (
            <button 
              onClick={handleFetchProfile}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Fetch Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}
