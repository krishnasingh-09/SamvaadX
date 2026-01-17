"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { useAuthStore } from "../store/useAuthStore"
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import { MessageCircleIcon, CheckCircleIcon, AlertCircleIcon, LoaderIcon } from "lucide-react"
import toast from "react-hot-toast"

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verifyOTP, isVerifyingOTP } = useAuthStore()

  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState(searchParams.get("email") || "")
  const [requiresOTP, setRequiresOTP] = useState(searchParams.get("requiresOTP") === "true")

  const [verificationStatus, setVerificationStatus] = useState("waiting") // waiting | verifying | success | error
  const [timer, setTimer] = useState(0)
  const RESEND_COOLDOWN = 60

  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP")
      return
    }

    setVerificationStatus("verifying")
    await verifyOTP(email, otp, navigate)
    setVerificationStatus("success")
  }

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email is required")
      return
    }

    if (timer > 0) return

    try {
      const { axiosInstance } = await import("../lib/axios")
      await axiosInstance.post("/auth/resend-otp", { email })
      toast.success("OTP resent to your email")
      setTimer(RESEND_COOLDOWN)
      setOtp("")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP")
    }
  }

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-md">
        <BorderAnimatedContainer>
          <div className="p-8 text-center">
            {requiresOTP ? (
              <>
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />

                {verificationStatus === "verifying" ? (
                  <>
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Verifying OTP</h2>
                    <p className="text-slate-400 mb-8">Please wait while we verify your OTP...</p>
                    <LoaderIcon className="w-8 h-8 mx-auto animate-spin text-cyan-400" />
                  </>
                ) : verificationStatus === "success" ? (
                  <>
                    <CheckCircleIcon className="w-12 h-12 mx-auto text-green-500 mb-4" />
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Email Verified!</h2>
                    <p className="text-slate-400 mb-4">Your account has been successfully created and verified.</p>
                    <p className="text-slate-500 text-sm">Redirecting to chat...</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Verify Your Email</h2>
                    <p className="text-slate-400 mb-6">
                      We've sent a 6-digit OTP to <b>{email}</b>
                    </p>

                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                      <div>
                        <label className="auth-input-label">Enter OTP</label>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                          className="input text-center text-2xl tracking-widest"
                          placeholder="000000"
                          maxLength="6"
                          disabled={isVerifyingOTP}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingOTP || otp.length !== 6}
                        className="auth-btn w-full disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isVerifyingOTP ? <LoaderIcon className="w-5 h-5 mx-auto animate-spin" /> : "Verify OTP"}
                      </button>
                    </form>

                    <div className="mt-4 text-center">
                      <p className="text-slate-400 text-sm mb-3">Didn't receive the OTP?</p>
                      <button
                        onClick={handleResendOTP}
                        disabled={timer > 0 || isVerifyingOTP}
                        className="text-cyan-400 hover:text-cyan-300 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {timer > 0 ? `Resend available in ${timer}s` : "Resend OTP"}
                      </button>
                    </div>

                    <a href="/signup" className="block text-center text-cyan-400 hover:text-cyan-300 text-sm mt-4">
                      Back to Sign Up
                    </a>
                  </>
                )}
              </>
            ) : (
              <>
                <AlertCircleIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">Invalid Link</h2>
                <p className="text-slate-400 mb-6">This verification page is invalid or has expired.</p>
                <a href="/signup" className="block text-center text-cyan-400 hover:text-cyan-300 text-sm">
                  Back to Sign Up
                </a>
              </>
            )}
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  )
}

export default VerifyEmailPage
