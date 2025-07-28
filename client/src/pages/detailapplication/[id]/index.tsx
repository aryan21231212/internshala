import axios from "axios";
import { Building2, Calendar, FileText, Loader2, User } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const ApplicationDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null); // Changed from [] to null

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) return; // Don't fetch if no ID
        
        const res = await axios.get(
          `https://internshala-b8sn.onrender.com/api/application/${id}`
        );
        
        if (res.data) {
          setData(res.data);
        } else {
          setError("No data received from server");
        }
      } catch (error: any) {
        console.error("Error fetching application:", error);
        setError(error.response?.data?.message || "Failed to load application");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">
          Loading application details...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">{error}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No application data found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <section key={data._id} className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Video Section */}
            <div className="relative bg-gray-100 min-h-[400px] flex items-center justify-center">
              {data.video?.url ? (
                <>
                  <video 
                    className="w-full h-full object-cover" 
                    controls 
                    src={data.video.url}
                  />
                  {data.status && (
                    <div
                      className={`absolute top-4 right-4 px-4 py-2 rounded-full ${
                        data.status === "accepted"
                          ? "bg-green-100 text-green-600"
                          : data.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <span className="font-semibold capitalize">
                        {data.status}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center p-8">
                  <p className="text-gray-500 mb-4">No video submitted</p>
                  {data.status && (
                    <div
                      className={`inline-block px-4 py-2 rounded-full ${
                        data.status === "accepted"
                          ? "bg-green-100 text-green-600"
                          : data.status === "rejected"
                          ? "bg-red-100 text-red-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      <span className="font-semibold capitalize">
                        {data.status}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-sm font-medium text-gray-500">Company</h2>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {data.company || "Not specified"}
                </h1>
              </div>

              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-sm font-medium text-gray-500">
                    Cover Letter
                  </h2>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {data.coverLetter || "No cover letter provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Application Date
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {data.createdAt
                      ? new Date(data.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown date"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <User className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-500">
                      Applied By
                    </span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {data.user?.name || "Unknown user"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ApplicationDetails;