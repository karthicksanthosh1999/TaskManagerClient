import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Login from './screens/Login'
import Navbar from './components/nav/Navbar'

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </>
  )
}

export default App
