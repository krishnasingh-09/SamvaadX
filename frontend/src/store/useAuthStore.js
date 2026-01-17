import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isVerifyingOTP: false,
  isSendingResetOTP: false,
  isResettingPassword: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check")
      set({ authUser: res.data })
      get().connectSocket()
    } catch (error) {
      console.log("Error in authCheck:", error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  signup: async (data, navigate) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post("/auth/signup", data)

      if (res.data.requiresOTP) {
        toast.success("OTP sent to your email. Please verify to complete signup.")
        if (navigate) {
          navigate(`/verify-email?email=${encodeURIComponent(data.email)}&requiresOTP=true`)
        }
      } else {
        toast.success("Account created successfully!")
        get().connectSocket()
        if (navigate) {
          navigate("/")
        }
      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isSigningUp: false })
    }
  },

  verifyOTP: async (email, otp, navigate) => {
    set({ isVerifyingOTP: true })
    try {
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp })
      set({ authUser: res.data })
      toast.success("Email verified successfully! Account created.")
      get().connectSocket()
      if (navigate) {
        navigate("/")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP")
    } finally {
      set({ isVerifyingOTP: false })
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true })
    try {
      const res = await axiosInstance.post("/auth/login", data)
      set({ authUser: res.data })

      toast.success("Logged in successfully")

      get().connectSocket()
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isLoggingIn: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout")
      set({ authUser: null })
      toast.success("Logged out successfully")
      get().disconnectSocket()
    } catch (error) {
      toast.error("Error logging out")
      console.log("Logout error:", error)
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data)
      set({ authUser: res.data })
      toast.success("Profile updated successfully")
    } catch (error) {
      console.log("Error in update profile:", error)
      toast.error(error.response.data.message)
    }
  },

  connectSocket: () => {
    const { authUser } = get()
    if (!authUser || get().socket?.connected) return

    const socket = io(BASE_URL, {
      withCredentials: true,
    })

    socket.connect()

    set({ socket })

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect()
  },

  forgotPassword: async (email) => {
    set({ isSendingResetOTP: true })
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email })
      toast.success(res.data.message)
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP")
      return false
    } finally {
      set({ isSendingResetOTP: false })
    }
  },

  resetPassword: async (email, otp, newPassword, navigate) => {
    set({ isResettingPassword: true })
    try {
      const res = await axiosInstance.post("/auth/reset-password", { email, otp, newPassword })
      toast.success(res.data.message)
      if (navigate) {
        navigate("/login")
      }
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password")
      return false
    } finally {
      set({ isResettingPassword: false })
    }
  },
}))







// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

// export const useAuthStore = create((set, get) => ({
//   authUser: null,
//   isCheckingAuth: true,
//   isSigningUp: false,
//   isLoggingIn: false,
//   socket: null,
//   onlineUsers: [],

//   checkAuth: async () => {
//     try {
//       const res = await axiosInstance.get("/auth/check");
//       set({ authUser: res.data });
//       get().connectSocket();
//     } catch (error) {
//       console.log("Error in authCheck:", error);
//       set({ authUser: null });
//     } finally {
//       set({ isCheckingAuth: false });
//     }
//   },

//   signup: async (data) => {
//     set({ isSigningUp: true });
//     try {
//       const res = await axiosInstance.post("/auth/signup", data);
//       set({ authUser: res.data });

//       toast.success("Account created successfully!");
//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isSigningUp: false });
//     }
//   },

//   login: async (data) => {
//     set({ isLoggingIn: true });
//     try {
//       const res = await axiosInstance.post("/auth/login", data);
//       set({ authUser: res.data });

//       toast.success("Logged in successfully");

//       get().connectSocket();
//     } catch (error) {
//       toast.error(error.response.data.message);
//     } finally {
//       set({ isLoggingIn: false });
//     }
//   },

//   logout: async () => {
//     try {
//       await axiosInstance.post("/auth/logout");
//       set({ authUser: null });
//       toast.success("Logged out successfully");
//       get().disconnectSocket();
//     } catch (error) {
//       toast.error("Error logging out");
//       console.log("Logout error:", error);
//     }
//   },

//   updateProfile: async (data) => {
//     try {
//       const res = await axiosInstance.put("/auth/update-profile", data);
//       set({ authUser: res.data });
//       toast.success("Profile updated successfully");
//     } catch (error) {
//       console.log("Error in update profile:", error);
//       toast.error(error.response.data.message);
//     }
//   },

//   connectSocket: () => {
//     const { authUser } = get();
//     if (!authUser || get().socket?.connected) return;

//     const socket = io(BASE_URL, {
//       withCredentials: true, // this ensures cookies are sent with the connection
//     });

//     socket.connect();

//     set({ socket });

//     // listen for online users event
//     socket.on("getOnlineUsers", (userIds) => {
//       set({ onlineUsers: userIds });
//     });
//   },

//   disconnectSocket: () => {
//     if (get().socket?.connected) get().socket.disconnect();
//   },
// }));
