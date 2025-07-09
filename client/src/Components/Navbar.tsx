import React, { useEffect, useState } from "react";
import Link from "next/link";
import { auth, provider } from "../firebase/firebase";
import { Search } from "lucide-react";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectuser } from "@/Feature/Userslice";
import io from "socket.io-client";

const SOCKET_SERVER_URL = "https://internshala-b8sn.onrender.com";

const Navbar = () => {
  const user = useSelector(selectuser);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedPref = localStorage.getItem("notificationEnabled");
    if (storedPref === "true") {
      setNotificationEnabled(true);
    }
  }, []);

  // Ask for notification permission
  useEffect(() => {
    localStorage.setItem("notificationEnabled", notificationEnabled.toString());

    if (notificationEnabled) {
      if (!("Notification" in window)) {
        toast.error("This browser does not support notifications.");
        setNotificationEnabled(false);
        return;
      }

      if (Notification.permission === "granted") {
        toast.success("Browser notifications are enabled");
      } else if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            toast.success("Browser notifications enabled");
          } else {
            toast.warn("Notification permission not granted");
            setNotificationEnabled(false);
          }
        });
      } else if (Notification.permission === "denied") {
        toast.error("Notifications are blocked in browser settings");
        setNotificationEnabled(false);
      }
    }
  }, [notificationEnabled]);

  // Setup Socket.io and browser notification listener
  useEffect(() => {
    if (!user || !user._id || !notificationEnabled) return;

    const socket = io(SOCKET_SERVER_URL, {
      transports: ["websocket"],
    });

    socket.emit("join", user._id);

    socket.on("application-status-changed", ({ message, status }) => {
      if (Notification.permission === "granted") {
        new Notification("Application Update", {
          body: message,
          icon: "/logo.png",
        });
      }
      toast.info(`Application ${status}`);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, notificationEnabled]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    }
  };

  const handleLogout = () => {
    signOut(auth);
    toast.info("Logged out");
  };

  return (
    <div className="relative">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-blue-600">
                <img src={"/logo.png"} alt="logo" className="h-16" />
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href={"/internship"} className="text-gray-700 hover:text-blue-600">
                Internships
              </Link>
              <Link href={"/job"} className="text-gray-700 hover:text-blue-600">
                Jobs
              </Link>
              <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  className="ml-2 bg-transparent focus:outline-none text-sm w-48"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative flex items-center space-x-4">
                  <Link href={"/profile"}>
                    <img src={user.photo} alt="user" className="w-8 h-8 rounded-full" />
                  </Link>

                  {/* Notification Toggle */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                    <span className="text-blue-600 font-medium flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                      </svg>
                      Notifications
                    </span>
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="notificationToggle"
                        className="sr-only peer"
                        checked={notificationEnabled}
                        onChange={(e) => setNotificationEnabled(e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 rounded-full peer peer-checked:bg-blue-600 transition-all duration-300"></div>
                      <span className="ml-3 text-sm text-gray-600">
                        {notificationEnabled ? "On" : "Off"}
                      </span>
                    </label>
                  </div>

                  <button
                    className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center justify-center space-x-2 hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-gray-700">Continue with Google</span>
                  </button>
                  <a href="/adminlogin" className="text-gray-600 hover:text-gray-800">
                    Admin
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
