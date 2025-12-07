'use client'

import { createPortal } from 'react-dom'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Mail, Lock, Loader2, Github, KeyRound } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'verify_otp'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const [cooldown, setCooldown] = useState(0)

  // Check for existing cooldown on mount and start timer
  useEffect(() => {
    const timer = setInterval(() => {
      const lastSent = localStorage.getItem('otp_last_sent')
      if (lastSent) {
        const secondsLeft = 300 - Math.floor((Date.now() - parseInt(lastSent)) / 1000)
        setCooldown(secondsLeft > 0 ? secondsLeft : 0)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email for the confirmation link.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onClose() // Close modal on successful login
        window.location.reload() // Refresh to update UI state
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (cooldown > 0) {
      setError(`Please wait ${Math.ceil(cooldown / 60)} minutes before trying again`)
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false }
      })
      if (error) throw error
      
      localStorage.setItem('otp_last_sent', Date.now().toString())
      setCooldown(300)
      
      setMode('verify_otp')
      setMessage('We sent a verification code to your email.')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attempts >= 3) {
      setError('Too many failed attempts. Please try again later.')
      return
    }

    setError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email'
      })
      
      if (error) {
        setAttempts(prev => prev + 1)
        throw error
      }
      
      // Success - User is logged in
      onClose()
      router.push('/update-password')
    } catch (err: any) {
      setError(`Invalid code. Attempts remaining: ${2 - attempts}`)
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-opacity animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {mode === 'signin' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot_password' && 'Reset Password'}
              {mode === 'verify_otp' && 'Check Your Email'}
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              {mode === 'signin' && 'Enter your details to sign in to your account'}
              {mode === 'signup' && 'Enter your details to create a new account'}
              {mode === 'forgot_password' && 'We’ll send a code to reset your password'}
              {mode === 'verify_otp' && `Enter the 8-digit code sent to ${email}`}
            </p>
          </div>

          {/* Error/Message Display */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 text-green-600 text-sm rounded-lg">
              {message}
            </div>
          )}

          {/* SIGN IN / SIGN UP MODE */}
          {(mode === 'signin' || mode === 'signup') && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-6"
              >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>
                  {mode === 'signin' && (
                    <div className="text-right">
                       <button
                        type="button"
                        onClick={() => setMode('forgot_password')}
                        className="text-sm text-gray-500 hover:text-black hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.98] duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Sign Up'
                  )}
                </button>
              </form>
            </>
          )}

          {/* FORGOT PASSWORD MODE */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

               <button
                  type="submit"
                  disabled={loading || cooldown > 0}
                  className="w-full py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.98] duration-200 disabled:opacity-70 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : cooldown > 0 ? (
                    `Resend in ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, '0')}`
                  ) : (
                    'Send Reset Code'
                  )}
                </button>
            </form>
          )}

          {/* VERIFY OTP MODE */}
          {mode === 'verify_otp' && (
             <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Authorization Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    required
                    value={otpCode}
                    onChange={(e) => {
                      // Enforce numeric only
                      const val = e.target.value.replace(/\D/g, '')
                      setOtpCode(val)
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-mono tracking-widest text-center text-lg"
                    placeholder="12345678"
                    maxLength={8}
                  />
                </div>
              </div>

               <button
                  type="submit"
                  disabled={loading || otpCode.length !== 8}
                  className="w-full py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform active:scale-[0.98] duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
                </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            {mode === 'signin' ? (
              <>
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')}
                  className="text-black font-semibold hover:underline"
                >
                  Sign up
                </button>
              </>
            ) : mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('signin')}
                  className="text-black font-semibold hover:underline"
                >
                  Sign in
                </button>
              </>
            ) : (
               <button 
                  onClick={() => setMode('signin')}
                  className="text-black font-semibold hover:underline"
                >
                  Back to Sign In
                </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
