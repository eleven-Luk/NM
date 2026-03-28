import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';



function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading ] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      localStorage.setItem('token', response.data.token);
      navigate('/choose');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
    } finally { 
      setLoading(false);
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  return (
  <div className='max-h-screen bg-stone-50 flex items-center justify-center p-4'>
    <div className='max-w-xl w-full'>

      {/* Header */}
      <div className='text-center mt-6  mb-8'>
        <p className='text-sm font-light text-gray-4000 mb-2 tracking-wider'>ACCOUNT / LOGIN</p>
        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 leading-tight tracking-wide">
          WELCOME BACK
        </h1>
        <p className="text-gray-500 font-light">SIGN IN TO YOUR ACCOUNT</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200">
          <p className="text-red-600 text-center font-light tracking-wider text-sm">{error}</p>
        </div>
      )}

      <div className='bg-white border border-gray-200 p-8'>
        <form onSubmit={handleSubmit} className='space-y-6 h-full'>
          <div>
            <label className='block text-xs font-light text-gray-400 mb-2 tracking-wider'>
              <FontAwesomeIcon  icon={faEnvelope} className='mr-2'/>
              EMAIL ADDRESS
            </label>
            <input 
             type="email" 
             name="email"
             value={formData.email}
             placeholder="Enter your email"
             required
             disabled={loading}
             onChange={handleChange}
             className="w-full p-3 border border-gray-200 text-gray-800 font-light focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50 bg-white"
            />
          </div>
          <div>
            <label className='block text-xs font-light text-gray-400 mb-2 tracking-wider'>
              <FontAwesomeIcon  icon={faLock} className='mr-2'/>
              PASSWORD
            </label>
            <div className='relative'>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="password" 
                placeholder="Enter your password"
                required
                disabled={loading}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 text-gray-800 font-light focus:border-gray-400 focus:outline-none transition-colors disabled:opacity-50 bg-white"
              />
              <button 
                type="button"
                onClick={toggleShowPassword}
                disabled={loading}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
              >
               <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye}
                 className="text-gray-400 hover:text-gray-600 transition-colors"
              />
              </button>
            </div>
          </div>

         {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 border border-gray-300 text-gray-600 text-sm font-light tracking-wider hover:border-gray-900 hover:text-gray-900 hover:bg-stone-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default Login;