'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import Cookies from 'js-cookie'
import { userAtom } from '../../state/userAtom'
import { FaUser, FaLock } from 'react-icons/fa'
import Lottie from 'react-lottie-player'
import axios from 'axios'

// Import Lottie animations
import loginAnimation from './login-animation.json'
import successAnimation from './success-animation.json'
import { toast } from 'react-toastify'
import { BACKEND_URL } from '../../config'

const InputField = ({ icon: Icon, ...props }: { icon: any; [key: string]: any }) => (
  <div className="relative">
    <Icon className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
    <input
      {...props}
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
    />
  </div>
)

export default function Login() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [currentAdmin, setCurrentAdmin] = useRecoilState<any>(userAtom)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
 

    try {

      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        name,
        password
      })

      
    if(response.status != 200) {
      setIsLoading(false)
      toast.error(response.data.message)
      return
    }

    const admin = response.data.data
      Cookies.set('user', JSON.stringify(admin), { expires: 0.25 }) // 6 hours
      setCurrentAdmin(admin)
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error : any) {
      setIsLoading(false)
      toast.error(error.response.data.message)
    }

  
  }

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-blue-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-blue-600 mb-6">Welcome Back!</h1>
            <p className="text-gray-600 mb-8">Log in to access your account and manage your school.</p>
          </motion.div>
          <Lottie
            loop
            animationData={loginAnimation}
            play
            style={{ width: '100%', height: '300px' }}
          />
        </div>
        <div className="w-full md:w-1/2 p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                icon={FaUser}
                type="text"
                id="name"
                value={name}
                onChange={(e : any) => setName(e.target.value)}
                placeholder="Username"
                required
                disabled={isLoading || isSuccess}
              />
              <div className="relative">
                <InputField
                  icon={FaLock}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e: { target: { value: React.SetStateAction<string> } }) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <motion.div
                    className="w-6 h-6 border-t-2 border-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </form>
            <div className="mt-6 text-center">
              <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
            </div>
          </motion.div>
        </div>
      </div>
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-8 max-w-sm w-full shadow-2xl"
            >
              <Lottie
                loop={false}
                animationData={successAnimation}
                play
                style={{ width: 200, height: 200, margin: '0 auto' }}
              />
              <h3 className="text-2xl font-bold text-center text-green-600 mt-4">Login Successful!</h3>
              <p className="text-center text-gray-600 mt-2">Redirecting to dashboard...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}