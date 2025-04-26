import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  PencilLine, 
  Trash, 
  Plus, 
  AlertTriangle, 
  Search, 
  ArrowUp,
  ArrowDown,
  Eye
} from "lucide-react";
import Navbar from "../NavBar";
import Footer from "../Footer";
import { getAdvisorUniversities, deleteUniversity, getImageUrl } from "../../services/universityService";
import { useAuth } from "../../contexts/useAuth";

const ManageUniversities: React.FC = () => {
  const navigate = useNavigate();
  const { isAdvisor } = useAuth();
  
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if user is advisor and fetch universities
  useEffect(() => {
    console.log("ManageUniversities useEffect: isAdvisor =", isAdvisor); // <-- Add log here

    if (!isAdvisor) {
      console.log("ManageUniversities: Not an advisor or check pending, navigating away."); // <-- Add log here
      navigate("/");
      return;
    }

    const fetchUniversities = async () => {
      console.log("ManageUniversities: Attempting to fetch advisor universities..."); // <-- Add log here
      setLoading(true);
      try {
        const data = await getAdvisorUniversities();
        console.log("ManageUniversities: Successfully fetched universities:", data); // <-- Add log here
        setUniversities(data);
        setError(null);
      } catch (err) {
        console.error("ManageUniversities: Error fetching universities:", err); // <-- Add log here
        setError("فشل في تحميل قائمة الجامعات");
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, [isAdvisor, navigate]);

  // Sort universities
  const sortUniversities = (a: any, b: any) => {
    let comparison = 0;

    // Handle different field types
    if (sortField === "name" || sortField === "type" || sortField === "location") {
      comparison = a[sortField].localeCompare(b[sortField]);
    } else if (sortField === "views") {
      comparison = parseInt(a[sortField] || 0) - parseInt(b[sortField] || 0);
    } else if (sortField === "createdAt") {
      const dateA = new Date(a[sortField] || 0).getTime();
      const dateB = new Date(b[sortField] || 0).getTime();
      comparison = dateA - dateB;
    }

    // Apply sort direction
    return sortDirection === "asc" ? comparison : -comparison;
  };

  // Handle sort click
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Handle university deletion
  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await deleteUniversity(id);
      setUniversities(prev => prev.filter(uni => uni.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting university:", err);
      setError("فشل في حذف الجامعة");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter universities based on search query
  const filteredUniversities = universities.filter(
    uni => 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort(sortUniversities);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
            <Link 
              to="/universities/add" 
              className="bg-white text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 ml-1" />
              إضافة جامعة جديدة
            </Link>
            <h1 className="text-2xl font-bold">إدارة الجامعات</h1>
          </div>
          
          {error && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 ml-2" />
              <p>{error}</p>
            </div>
          )}
          
          {/* Search Bar */}
          <div className="p-4 border-b">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="البحث عن جامعة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
              />
            </div>
          </div>
          
          {/* Universities Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto h-20 w-20 text-gray-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700">لا توجد جامعات</h3>
                <p className="text-gray-500 mt-2 mb-6">
                  لم تقم بإضافة أي جامعات بعد.
                </p>
                <Link
                  to="/universities/add"
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                >
                  <Plus className="w-5 h-5 ml-1" />
                  إضافة أول جامعة
                </Link>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الصورة
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center justify-end">
                        <span>اسم الجامعة</span>
                        {sortField === "name" && (
                          sortDirection === "asc" ? 
                            <ArrowUp className="w-4 h-4 mr-1" /> : 
                            <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("type")}
                    >
                      <div className="flex items-center justify-end">
                        <span>النوع</span>
                        {sortField === "type" && (
                          sortDirection === "asc" ? 
                            <ArrowUp className="w-4 h-4 mr-1" /> : 
                            <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("location")}
                    >
                      <div className="flex items-center justify-end">
                        <span>الموقع</span>
                        {sortField === "location" && (
                          sortDirection === "asc" ? 
                            <ArrowUp className="w-4 h-4 mr-1" /> : 
                            <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("views")}
                    >
                      <div className="flex items-center justify-end">
                        <span>المشاهدات</span>
                        {sortField === "views" && (
                          sortDirection === "asc" ? 
                            <ArrowUp className="w-4 h-4 mr-1" /> : 
                            <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center justify-end">
                        <span>تاريخ الإضافة</span>
                        {sortField === "createdAt" && (
                          sortDirection === "asc" ? 
                            <ArrowUp className="w-4 h-4 mr-1" /> : 
                            <ArrowDown className="w-4 h-4 mr-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUniversities.map((university) => (
                    <tr key={university.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 rounded overflow-hidden bg-gray-200">
                          {university.image && (
                            <img 
                              src={getImageUrl(university.image)} 
                              alt={university.name} 
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">{university.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-500">{university.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-500">{university.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-500 flex items-center justify-end">
                          <Eye className="w-4 h-4 ml-1 text-gray-400" />
                          <span>{university.views || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(university.createdAt).toLocaleDateString('ar-EG')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-3">
                          {deleteConfirm === university.id ? (
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                إلغاء
                              </button>
                              <button
                                onClick={() => handleDelete(university.id)}
                                disabled={isDeleting}
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center"
                              >
                                {isDeleting && <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white ml-1"></div>}
                                تأكيد الحذف
                              </button>
                            </div>
                          ) : (
                            <>
                              <Link
                                to={`/universities/edit/${university.id}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <PencilLine className="h-5 w-5" />
                              </Link>
                              <button
                                onClick={() => setDeleteConfirm(university.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash className="h-5 w-5" />
                              </button>
                              <Link
                                to={`/university-details/${university.id}`}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Eye className="h-5 w-5" />
                              </Link>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ManageUniversities;
