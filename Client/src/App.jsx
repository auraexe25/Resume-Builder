import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard.jsx'
import ResumeBuilder from './pages/ResumeBuilder'
import LoginPage from './pages/Login'
import Preview from './pages/Preview'
import { useDispatch } from 'react-redux'
import api from './configs/api.js'
import { login, setLoading } from './app/features/authSlice.js'
import {Toaster} from 'react-hot-toast'

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        if (token) {
          const { data } = await api.get('/api/users/data', {
            headers: { Authorization: token }
          });

          if (data?.user) {
            dispatch(login({ token, user: data.user }));
          }
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        dispatch(setLoading(false));
      }
    };

    getUserData();
  }, [dispatch]);

  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/app/login' element={<Navigate to='/login' replace />} />
        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>
        <Route path='view/:resumeId' element={<Preview />} />
      </Routes>
    </>
  )
}

export default App