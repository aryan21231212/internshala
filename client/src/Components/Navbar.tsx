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


  useEffect(() => {
    const storedPref = localStorage.getItem("notificationEnabled");
    if (storedPref === "true") {
      setNotificationEnabled(true);
    }
  }, []);


  useEffect(() => {
    localStorage.setItem("notificationEnabled", notificationEnabled.toString());

    if (notificationEnabled) {
      if (!("Notification" in window)) {
        toast.error("Browser does not support notifications.");
        setNotificationEnabled(false);
        return;
      }


      if (Notification.permission === "granted") {

        toast.success("Notifications are enabled");
      } else if (Notification.permission === "default") {

        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            toast.success("Notifications enabled");
          } else {
            toast.warn("Permission not granted");
            setNotificationEnabled(false);
          }
        });
      } else {

        toast.error("Notifications are blocked in browser settings");
        setNotificationEnabled(false);
      }
    }
  }, [notificationEnabled]);


  useEffect(() => {
    if (!notificationEnabled) return;

    const socket = io(SOCKET_SERVER_URL);

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
      if (user?.uid) {
        console.log("Joining room with user ID:", user.uid);
        socket.emit("join", user.uid);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("application-status-changed", ({ message, status }) => {
      console.log("Received:", message, status);
      if (notificationEnabled && Notification.permission === "granted") {
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

  const testNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a test notification from CareerConnect",
        icon: "/logo.png",
      });
    } else {
      toast.warn("Please enable notifications first");
    }
  };

  const resetNotificationSettings = () => {
    toast.info(
      <div>
        <p>To reset notification permissions:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Chrome: Settings → Privacy and Security → Site Settings → Notifications</li>
          <li>Firefox: Options → Privacy & Security → Permissions → Notifications → Settings</li>
          <li>Safari: Preferences → Websites → Notifications</li>
        </ul>
      </div>,
      { autoClose: false }
    );
  };

  return (
    <div className="relative">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <a href="/" className="text-xl font-bold text-blue-600">
                <img src={"/logo.png"} alt="logo" className="h-16" />
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href={"/internship"}>Internships</Link>
              <Link href={"/job"}>Jobs</Link>
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

                  <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                    <span className="text-blue-600 font-medium flex items-center gap-1">
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
                      <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full transition-all duration-300"></div>
                      <span className="ml-3 text-sm text-gray-600">
                        {notificationEnabled ? "On" : "Off"}
                      </span>
                    </label>

                    {notificationEnabled && (
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={testNotification}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                          title="Test notification"
                        >
                          Test
                        </button>
                        <button
                          onClick={resetNotificationSettings}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          title="Reset notification settings"
                        >
                          Reset
                        </button>
                      </div>
                    )}
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
                  <button onClick={handleLogin} className="bg-white border rounded-lg px-4 py-2">
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