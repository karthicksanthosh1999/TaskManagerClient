import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './screens/Home';
import Login from './screens/Login';
import ProtectedRoute from './components/protector/ProtectedRoute';

export const BASEURL = import.meta.env.VITE_API_BASE_URL;
function App() {

  return (
    <section className='dark:bg-gray-900 h-screen'>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<ProtectedRoute children={<Home />} />} />
      </Routes>
    </section>
  )
}

export default App
