import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

export const AuthContext = createContext();


const backendUrl = import.meta.env.VITE_BACKEND_URL
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {

  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);


  // check if user is  authrorized and if so set uder dat and connect
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");

      if (data.success) {
        setAuthUser(data.user)
        connectSocket(data.user)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }
  // login function to handle user

  const login = async (state, credentails) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentails)

      if (data.success) {
        setAuthUser(data.userData)
        connectSocket(data.userData)
        axios.defaults.headers.common["token"] = data.token
        setToken(data.token)
        localStorage.setItem("token", data.token)
        toast.success(data.message)
      }

      else {
        toast.success(data.message)

      }
    }

    catch (error) {
      toast.error(error.message)
    }
  };


  // logout function to handle the logout and socket disconnectios

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["token"] = null;
    toast.success("Logged out successfully")
    socket.disconnect();
  };


  // update profile function with handle socket

  const updateProfile = async (body) => {
    try {

      const { data } = await axios.put("/api/auth/update-profile", body)

      if (data.success) {
        setAuthUser(data.user)
        toast.success("Profile updated successfully")
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  //  connect socket fn handle socket connection
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      }
    })

    newSocket.connect()
    setSocket(newSocket)

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds)
    })
  }


  // jab token set ho to hamesha axios me default header laga do
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth()
  }, []);


  const value = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile

  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};
