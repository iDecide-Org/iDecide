import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  College,
  getCollegesByUniversity,
} from "../../../services/collegeService"; // Corrected path
import {
  deleteMajor,
  getMajorsByCollege,
  Major,
} from "../../../services/majorService"; // Corrected path

export const MajorsCRUD: React.FC<{ universityId: string }> = ({
  universityId,
}) => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string | null>(
    null
  );
  const [majors, setMajors] = useState<Major[]>([]);
  const [loadingColleges, setLoadingColleges] = useState(true);
  const [loadingMajors, setLoadingMajors] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchColleges = async () => {
      setLoadingColleges(true);
      setError(null);
      try {
        const data = await getCollegesByUniversity(universityId);
        setColleges(data);
        // Optionally select the first college by default if available
        // if (data.length > 0) {
        //   setSelectedCollegeId(data[0].id);
        // }
      } catch (err) {
        setError("فشل في تحميل الكليات");
        console.error("Error fetching colleges for majors:", err);
      } finally {
        setLoadingColleges(false);
      }
    };
    fetchColleges();
  }, [universityId]);

  useEffect(() => {
    if (!selectedCollegeId) {
      setMajors([]);
      return;
    }
    const fetchMajors = async () => {
      setLoadingMajors(true);
      setError(null);
      try {
        const data = await getMajorsByCollege(selectedCollegeId);
        setMajors(data);
      } catch (err) {
        setError("فشل في تحميل التخصصات");
        console.error("Error fetching majors:", err);
      } finally {
        setLoadingMajors(false);
      }
    };
    fetchMajors();
  }, [selectedCollegeId]);

  const handleAddMajor = () => {
    if (!selectedCollegeId) {
      setError("يرجى اختيار كلية أولاً لإضافة تخصص.");
      return;
    }
    // Navigate to the Add Major page, passing the collegeId
    navigate(`/majors/add/${selectedCollegeId}`);
  };

  const handleEditMajor = (id: string) => {
    // Navigate to the Edit Major page, passing the majorId
    navigate(`/majors/edit/${id}`);
  };

  const handleDeleteMajor = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التخصص؟")) {
      try {
        setError(null);
        setLoadingMajors(true); // Indicate loading during delete
        await deleteMajor(id);
        setMajors(majors.filter((m) => m.id !== id));
      } catch (err) {
        setError("فشل في حذف التخصص");
        console.error("Error deleting major:", err);
      } finally {
        setLoadingMajors(false); // Stop loading indicator
      }
    }
  };

  return (
    // Use similar styling as CollegesCRUD
    <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-800">إدارة التخصصات</h3>
        <button
          onClick={handleAddMajor}
          disabled={!selectedCollegeId || loadingColleges} // Disable if no college selected or colleges loading
          className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center shadow-sm ${
            !selectedCollegeId || loadingColleges
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة تخصص
        </button>
      </div>

      {loadingColleges && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">جاري تحميل الكليات...</p>
        </div>
      )}

      {/* Display error related to colleges or majors */}
      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {!loadingColleges && colleges.length === 0 && !error && (
        <p className="text-center text-gray-500 py-10 border border-dashed border-gray-300 rounded-lg">
          يرجى إضافة كلية أولاً لإدارة التخصصات.
        </p>
      )}

      {!loadingColleges && colleges.length > 0 && (
        <div className="mb-6">
          {" "}
          {/* Increased margin-bottom */}
          <label
            htmlFor="collegeSelect"
            className="block text-sm font-medium text-gray-700 mb-2 text-right" // Added text-right
          >
            اختر الكلية لعرض تخصصاتها:
          </label>
          <select
            id="collegeSelect"
            value={selectedCollegeId || ""}
            onChange={(e) => setSelectedCollegeId(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-right" // Added text-right
            dir="rtl" // Ensure dropdown arrow is on the left
          >
            <option value="">-- اختر كلية --</option>
            {colleges.map((college) => (
              <option key={college.id} value={college.id}>
                {college.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Majors Table Section */}
      {selectedCollegeId && (
        <>
          {loadingMajors && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="ml-3 text-gray-600">جاري تحميل التخصصات...</p>
            </div>
          )}

          {!loadingMajors && !error && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              {majors.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  لا توجد تخصصات لهذه الكلية بعد.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الاسم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {majors.map((major) => (
                      <tr
                        key={major.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {major.name}
                        </td>
                        <td
                          className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
                          title={major.description}
                        >
                          {" "}
                          {/* Truncate long descriptions */}
                          {major.description || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                          <div className="flex items-center justify-start gap-3">
                            <button
                              onClick={() => handleEditMajor(major.id)}
                              className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 rounded-md hover:bg-indigo-100"
                              title="تعديل"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMajor(major.id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-1 rounded-md hover:bg-red-100"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
