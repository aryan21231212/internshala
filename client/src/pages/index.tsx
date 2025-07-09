import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ArrowUpRight,
  Banknote,
  Calendar,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import ChatBot from "../Components/chatbot"; // Ensure this path is correct

export default function SvgSlider() {
  const categories = [
    "Big Brands",
    "Work From Home",
    "Part-time",
    "MBA",
    "Engineering",
    "Media",
    "Design",
    "Data Science",
  ];

  const slides = [
    {
      pattern: "pattern-1",
      title: "Start Your Career Journey",
      bgColor: "bg-indigo-600",
    },
    {
      pattern: "pattern-2",
      title: "Learn From The Best",
      bgColor: "bg-blue-600",
    },
    {
      pattern: "pattern-3",
      title: "Grow Your Skills",
      bgColor: "bg-purple-600",
    },
    {
      pattern: "pattern-4",
      title: "Connect With Top Companies",
      bgColor: "bg-teal-600",
    },
  ];

  const stats = [
    { number: "300K+", label: "companies hiring" },
    { number: "10K+", label: "new openings everyday" },
    { number: "21Mn+", label: "active students" },
    { number: "600K+", label: "learners" },
  ];

  const [internships, setinternship] = useState<any>([]);
  const [jobs, setjob] = useState<any>([]);
  const [isChatbot, setisChatbot] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const [internshipres, jobres] = await Promise.all([
          axios.get("https://internshala-b8sn.onrender.com/api/internship"),
          axios.get("https://internshala-b8sn.onrender.com/api/job"),
        ]);
        setinternship(internshipres.data);
        setjob(jobres.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  const filteredInternships = internships.filter(
    (item: any) => !selectedCategory || item.category === selectedCategory
  );
  const filteredJobs = jobs.filter(
    (item: any) => !selectedCategory || item.category === selectedCategory
  );




  return (

   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* hero section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Make your dream career a reality
        </h1>
        <p className="text-xl text-gray-600">Trending on InternArea 🔥</p>
      </div>

      {/* Swiper section */}
      <div className="mb-16">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          className="rounded-xl overflow-hidden shadow-lg"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={`relative h-[400px] ${slide.bgColor}`}>
                <div className="absolute inset-0 opacity-20">
                  <svg
                    className="w-full h-full"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Patterns */}
                    <defs>
                      <pattern
                        id={slide.pattern}
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        {slide.pattern === "pattern-1" && (
                          <circle cx="10" cy="10" r="3" fill="white" />
                        )}
                        {slide.pattern === "pattern-2" && (
                          <rect x="15" y="15" width="10" height="10" fill="white" />
                        )}
                        {slide.pattern === "pattern-3" && (
                          <path d="M0 20 L20 0 L40 20 L20 40 Z" fill="white" />
                        )}
                        {slide.pattern === "pattern-4" && (
                          <path d="M30 5 L55 30 L30 55 L5 30 Z" fill="white" />
                        )}
                      </pattern>
                    </defs>
                    <rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill={`url(#${slide.pattern})`}
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-4xl font-bold text-white">
                    {slide.title}
                  </h2>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Category Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Latest internships on Intern Area
        </h2>
        <div className="flex flex-wrap gap-4">
          <span className="text-gray-700 font-medium">POPULAR CATEGORIES:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Internship Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {filteredInternships.map((internship: any, index: any) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105"
          >
            <div className="flex items-center gap-2 text-blue-600 mb-4">
              <ArrowUpRight size={20} />
              <span className="font-medium">Actively Hiring</span>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {internship.title}
            </h3>
            <p className="text-gray-500 mb-4">{internship.company}</p>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>{internship.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Banknote size={18} />
                <span>{internship.stipend}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{internship.duration}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                Internship
              </span>
              <Link
                href={`/detailiternship/${internship._id}`}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View details
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Jobs */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Jobs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredJobs.map((job: any, index: any) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:transform hover:scale-105"
            >
              <div className="flex items-center gap-2 text-blue-600 mb-4">
                <ArrowUpRight size={20} />
                <span className="font-medium">Actively Hiring</span>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                {job.title}
              </h3>
              <p className="text-gray-500 mb-4">{job.company}</p>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote size={18} />
                  <span>{job.CTC}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{job.Experience}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                  Jobs
                </span>
                <Link
                  href={`/detailInternship?q=${job._id}`}
                  className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  View details
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>


      <div
        onClick={() => setisChatbot(!isChatbot)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer z-50 hover:bg-blue-700 transition-colors"
        title="Chatbot"
      >
        <span className="text-sm font-semibold">chat!</span>
      </div>


      {isChatbot && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white shadow-lg border rounded-xl z-50 overflow-hidden flex flex-col">
          <ChatBot />
        </div>
      )}
    </div>
  );
}
