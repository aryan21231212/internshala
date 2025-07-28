import { selectuser } from "@/Feature/Userslice";
import axios from "axios";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const [internshipData, setinternship] = useState<any>([]);
  const [availability, setAvailability] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [email, setemail] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const user = useSelector(selectuser);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(
          `https://internshala-b8sn.onrender.com/api/internship/${id}`
        );
        setinternship(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) fetchdata();
  }, [id]);

  if (!internshipData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isWithinUploadTime = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; 
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    
    return hours >= 14 && hours < 19; 
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    if (!e.target.files || e.target.files.length === 0) {
      setVideoFile(null);
      return;
    }

    const file = e.target.files[0];
    
    if (!file.type.startsWith('video/')) {
      setUploadError("Please upload a video file");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setUploadError("Video size should not exceed 100MB");
      return;
    }
    
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      
      if (video.duration > 300) {
        setUploadError("Video duration should not exceed 5 minutes");
      } else {
        setVideoFile(file);
      }
    };
    
    video.src = URL.createObjectURL(file);
  };

  const handleOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const emailofuser = { email };
      const response = await axios.post(
        "https://internshala-b8sn.onrender.com/api/otp/send-otp",
        emailofuser
      );
      toast.success("OTP sent to your email!");
      setIsOtpModalOpen(true);
    } catch (error: any) {
      console.error("Failed to send OTP:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || "Failed to send OTP");
    }
  };

  const Otpverification = async () => {
    if (!otp) {
      toast.error("Please enter your Otp");
      return;
    }
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const detailsofuser = { email, otp };
      const response = await axios.post(
        "https://internshala-b8sn.onrender.com/api/otp/verify-otp",
        detailsofuser
      );
      toast.success("OTP Verified !");
      setIsOtpVerified(true);
      setIsOtpModalOpen(false);
    } catch (error: any) {
      console.error("Failed to send OTP:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.error || "Failed to verify OTP");
    }
  };

  const handlesubmitapplication = async () => {
    if (!coverLetter.trim()) {
      toast.error("Please write a cover letter");
      return;
    }
    if (!availability) {
      toast.error("Please select your availability");
      return;
    }
  
    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Append all application data as strings
      formData.append('company', internshipData.company);
      formData.append('category', internshipData.category);
      formData.append('coverLetter', coverLetter);
      formData.append('user', JSON.stringify(user));
      formData.append('Application', id as string);
      formData.append('availability', availability);
      
      // If video file exists, append it
      if (videoFile) {
        formData.append('video', videoFile);
      }
  
      // Debug: Log FormData contents
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Update the API endpoint to match your backend
      const response = await axios.post(
        "https://internshala-b8sn.onrender.com/api/application",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      toast.success("Application submitted successfully");
      router.push("/internship");
    } catch (error: any) {
      console.error("Submission error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      toast.error(error.response?.data?.message || "Failed to submit application");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-2 text-blue-600 mb-4">
            <ArrowUpRight className="h-5 w-5" />
            <span className="font-medium">Actively Hiring</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {internshipData.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{internshipData.company}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-5 w-5" />
              <span>{internshipData.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <DollarSign className="h-5 w-5" />
              <span>{internshipData.stipend}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              <span>{internshipData.startDate}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-green-500" />
            <span className="text-green-500 text-sm">
              Posted on {internshipData.createdAt}
            </span>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About {internshipData.company}
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Visit company website</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-600">{internshipData.aboutCompany}</p>
        </div>
        
        {/* Internship Details Section */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            About the Internship
          </h2>
          <p className="text-gray-600 mb-6">{internshipData.aboutInternship}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Who can apply
          </h3>
          <p className="text-gray-600 mb-6">{internshipData.whoCanApply}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">Perks</h3>
          <p className="text-gray-600 mb-6">{internshipData.perks}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Additional Information
          </h3>
          <p className="text-gray-600 mb-6">{internshipData.additionalInfo}</p>

          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Number of Openings
          </h3>
          <p className="text-gray-600">{internshipData.numberOfOpening}</p>
        </div>
        
        {/* Apply Button */}
        <div className="p-6 flex justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-150"
          >
            Apply Now
          </button>
        </div>
      </div>

      {/* Apply Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply to {internshipData.company}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Resume
                </h3>
                <p className="text-gray-600">
                  Your current resume will be submitted with the application
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Cover Letter
                </h3>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Write your cover letter here..."
                ></textarea>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Availability
                </h3>
                <div className="space-y-3">
                  {[
                    "Yes, I am available to join immediately",
                    "No, I am currently on notice period",
                    "No, I will have to serve notice period",
                    "Other",
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={option}
                        checked={availability === option}
                        onChange={(e) => setAvailability(e.target.value)}
                        className="h-4 w-4 text-blue-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {isOtpVerified ? (
                <div className="mt-8">
                  <h5 className="text-gray-900 mb-4">
                    Upload Demo Video
                  </h5>
                  {!isWithinUploadTime() ? (
                    <div className="text-red-500">
                      Video upload is only allowed between 2 PM to 7 PM IST
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadError && (
                        <div className="text-red-500 mt-2">{uploadError}</div>
                      )}
                      {videoFile && (
                        <div className="mt-2 text-sm text-gray-600">
                          Selected: {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Maximum video size: 100MB, Maximum duration: 5 minutes
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="mt-8">
                  <h5 className="text-gray-900 mb-4">
                    Enter your email to upload demo video
                  </h5>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      onChange={(e) => setemail(e.target.value)}
                      value={email}
                      className="w-full md:w-64 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                      onClick={handleOtp}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Send OTP
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                {user ? (
                  <button 
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                    onClick={handlesubmitapplication}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </span>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                ) : (
                  <Link
                    href={`/`}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Sign up to apply
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border p-3 rounded mb-4 text-black"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOtpModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await Otpverification();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Verify OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default index;