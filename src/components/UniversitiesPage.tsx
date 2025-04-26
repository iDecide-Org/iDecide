// UniversitiesPage.js
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "./NavBar";
import UniversityCard from "./UniversityCard"; // Import the UniversityCard component
import Footer from "./Footer";
import { getAllUniversities, University } from "../services/universityService";
import { addFavoriteUniversity, removeFavoriteUniversity, isUniversityInFavorites } from "../services/favoriteService"; // Corrected import name
import { useAuth } from "../contexts/useAuth";

const UniversitiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("الجامعات");
  const [isCumulativeFilter, setIsCumulativeFilter] = useState(false);
  const [universityName, setUniversityName] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { isLoggedIn } = useAuth();

  // Fetch universities when component mounts
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        // Fetch a large number of universities initially (e.g., 1000)
        const response = await getAllUniversities(1, 1000);
        console.log("Raw API response:", response); // Log raw API response

        // FIX: Check if the response itself is an array
        const universitiesData = Array.isArray(response) ? response : [];
        console.log("Processed universities data:", universitiesData); // Log processed data

        setUniversities(universitiesData);
        // Log state immediately after setting it (using a functional update to see the result)
        setUniversities(currentUniversities => {
          console.log("Universities state after setUniversities:", currentUniversities);
          return currentUniversities; // Return the same state, just logging it
        });

        setError(null);
      } catch (err) {
        console.error("Error fetching universities:", err);
        setError("فشل في تحميل بيانات الجامعات");
        setUniversities([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Check favorite status for universities if user is logged in
  useEffect(() => {
    // Ensure universities is always treated as an array for checks.
    const currentUniversities = Array.isArray(universities) ? universities : [];

    // Guard clauses
    if (!isLoggedIn) {
      setFavorites({});
      return;
    }
    // Use the guaranteed array for the length check
    if (currentUniversities.length === 0) {
      setFavorites({});
      return;
    }

    // Define and call the async function only if checks pass
    const checkFavorites = async () => {
      const favoritesMap: Record<string, boolean> = {};
      // Iterate over the guaranteed array
      for (const university of currentUniversities) {
        if (university && university.id) {
          try {
            const isFavorite = await isUniversityInFavorites(university.id);
            favoritesMap[university.id] = isFavorite;
          } catch (error) {
            console.error(`Error checking favorite status for university ${university.id}:`, error);
          }
        } else {
          console.warn("Encountered invalid university object in favorites check:", university);
        }
      }
      setFavorites(favoritesMap);
    };

    checkFavorites();

  }, [isLoggedIn, universities]);

  // Handle filtering
  const handleFilter = async () => {
    setLoading(true);
    try {
      const response = await getAllUniversities(1, 10, {
        name: universityName,
        type: selectedType,
        location: selectedLocation
      });
      // Ensure response exists and response.universities is an array
      const universitiesData = response?.universities && Array.isArray(response.universities) ? response.universities : [];
      setUniversities(universitiesData);
      setError(null);
    } catch (err) {
      console.error("Error filtering universities:", err);
      setError("فشل في تصفية بيانات الجامعات");
      setUniversities([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Handle favorite toggling
  const handleFavoriteToggle = async (universityId: string) => {
    if (!isLoggedIn) return; // Only proceed if user is logged in
    
    try {
      if (favorites[universityId]) {
        await removeFavoriteUniversity(universityId); // Corrected function name usage
        setFavorites(prev => ({...prev, [universityId]: false}));
      } else {
        await addFavoriteUniversity(universityId);
        setFavorites(prev => ({...prev, [universityId]: true}));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Add console log here to check the state before rendering the list
  console.log("Universities state before render:", universities);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen w-full overflow-x-hidden">
      <Navbar />

      {/* Search and Filter Section */}
      <section className="bg-white p-6 border-b border-gray-200 w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-4">
          اكتشف أفضل الجامعات والكليات والتخصصات المتاحة.
        </h2>
        <p className="text-center text-gray-700 mb-6">
          ابحث عن الجامعات والكليات والتخصصات التي تلبي طموحاتك الأكاديمية.
        </p>

        {/* Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            className={`px-4 py-2 rounded-md focus:outline-none ${
              activeTab === "الجامعات"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition duration-200`}
            onClick={() => setActiveTab("الجامعات")}
          >
            الجامعات
          </button>
          <button
            className={`px-4 py-2 rounded-md focus:outline-none ${
              activeTab === "كليات"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition duration-200`}
            onClick={() => setActiveTab("كليات")}
          >
            كليات
          </button>
          <button
            className={`px-4 py-2 rounded-md focus:outline-none ${
              activeTab === "تخصصات الكليات"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            } transition duration-200`}
            onClick={() => setActiveTab("تخصصات الكليات")}
          >
            تخصصات الكليات
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
          <div className="relative flex-grow w-full md:w-auto">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="ابحث عن جامعة"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              className="w-full text-right px-9 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 pl-10"
            />
          </div>
          <select 
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">نوع الجامعة</option>
            <option value="الجامعات الخاصة">الجامعات الخاصة</option>
            <option value="الجامعات الأهلية">الجامعات الأهلية</option>
            <option value="الجامعات الحكومية">الجامعات الحكومية</option>
          </select>
          <select 
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">المكان (الأقاليم، محافظة)</option>
            <option value="القاهرة">القاهرة</option>
            <option value="الجيزة">الجيزة</option>
            <option value="الأسكندرية">الأسكندرية</option>
          </select>
          <button 
            className="w-full md:w-auto bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={handleFilter}
          >
            فلترة
          </button>
        </div>
        <div className="flex items-center justify-end">
          <label
            htmlFor="cumulativeFilter"
            className="flex items-center cursor-pointer"
          >
            <span className="text-gray-700 mr-2">الفلترة التراكمية</span>
            <div className="relative">
              <input
                type="checkbox"
                id="cumulativeFilter"
                className="sr-only"
                checked={isCumulativeFilter}
                onChange={() => setIsCumulativeFilter(!isCumulativeFilter)}
              />
              <div
                className={`w-10 h-5 bg-gray-400 rounded-full shadow-inner transition duration-300 ease-in-out transform ${
                  isCumulativeFilter ? "bg-blue-600" : ""
                }`}
              >
                <span
                  className={`absolute w-4 h-4 bg-white rounded-full shadow transform transition duration-300 ease-in-out ${
                    isCumulativeFilter ? "translate-x-5" : "translate-x-0.5"
                  }`}
                ></span>
              </div>
            </div>
          </label>
        </div>
      </section>

      {/* University Cards Section */}
      <section className="w-full flex-grow">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
                نتائج البحث : ({Array.isArray(universities) ? universities.length : 0})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-6 justify-items-center">
                {/* Add log inside the map function */}
                {Array.isArray(universities) && universities.map((university) => {
                  // Add a check for valid university object and ID
                  if (!university || !university.id) {
                    console.warn("Skipping rendering of invalid university object:", university);
                    return null; // Skip rendering this card
                  }
                  console.log("Rendering UniversityCard for:", university);
                  return (
                    <UniversityCard
                      key={university.id}
                      university={university}
                      showFavoriteButton={isLoggedIn}
                      isFavorite={favorites[university.id] || false}
                      onFavoriteClick={() => handleFavoriteToggle(university.id)}
                    />
                  );
                })}
              </div>
              
              {/* Add check for non-array or empty array */}
              {(!Array.isArray(universities) || universities.length === 0) && !loading && (
                <div className="text-center py-16">
                  <p className="text-gray-600 text-xl">لم يتم العثور على نتائج</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer className="mt-10" />
    </div>
  );
};

export default UniversitiesPage;
