"use client"

import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import { MailIcon, LoaderIcon, LockIcon, KeyIcon, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router"

function ForgotPasswordPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const { forgotPassword, resetPassword, isSendingResetOTP, isResettingPassword } = useAuthStore()
  const navigate = useNavigate()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    const success = await forgotPassword(email)
    if (success) {
      setStep(2)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match")
    }
    await resetPassword(email, otp, newPassword, navigate)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900 overflow-hidden">
      <div className="relative w-full max-w-6xl h-auto max-h-[90vh]">
        <BorderAnimatedContainer>
          <div className="w-full h-full flex flex-col md:flex-row">
            <div className="md:w-1/2 px-4 py-5 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-4">
                  <KeyIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <h2 className="text-xl font-bold text-slate-200 mb-1">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {step === 1
                      ? "Enter your email to receive a password reset OTP"
                      : "Enter the OTP sent to your email and your new password"}
                  </p>
                </div>

                {step === 1 ? (
                  <form onSubmit={handleSendOTP} className="space-y-3">
                    <div>
                      <label className="auth-input-label">Email</label>
                      <div className="relative">
                        <MailIcon className="auth-input-icon" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="input"
                          placeholder="johndoe@gmail.com"
                          required
                        />
                      </div>
                    </div>

                    <button className="auth-btn" type="submit" disabled={isSendingResetOTP}>
                      {isSendingResetOTP ? <LoaderIcon className="w-full h-5 animate-spin text-center" /> : "Send OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-3">
                    <div>
                      <label className="auth-input-label">OTP</label>
                      <div className="relative">
                        <KeyIcon className="auth-input-icon" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="input"
                          placeholder="Enter 6-digit OTP"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="auth-input-label">New Password</label>
                      <div className="relative">
                        <LockIcon className="auth-input-icon" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input"
                          placeholder="Enter new password"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="auth-input-label">Confirm Password</label>
                      <div className="relative">
                        <LockIcon className="auth-input-icon" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="input"
                          placeholder="Confirm new password"
                          minLength={6}
                          required
                        />
                      </div>
                    </div>

                    <button className="auth-btn" type="submit" disabled={isResettingPassword}>
                      {isResettingPassword ? (
                        <LoaderIcon className="w-full h-5 animate-spin text-center" />
                      ) : (
                        "Reset Password"
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full text-slate-400 hover:text-slate-200 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to email
                    </button>
                  </form>
                )}

                <div className="mt-3 text-center">
                  <Link to="/login" className="auth-link">
                    Remember your password? Sign In
                  </Link>
                </div>
              </div>
            </div>

            <div className="hidden md:w-1/2 md:flex items-center justify-center p-2 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div className="flex flex-col items-center">
                <img
                  src="/login.png"
                  alt="People using mobile devices"
                  className="w-full max-h-[280px] object-contain"
                />
                <div className="mt-3 text-center">
                  <h3 className="text-base font-medium text-cyan-400">Secure Password Reset</h3>
                  <div className="mt-2 flex justify-center gap-2">
                    <span className="auth-badge">OTP Verified</span>
                    <span className="auth-badge">Secure</span>
                    <span className="auth-badge">Quick</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
