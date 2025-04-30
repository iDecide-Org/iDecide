import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { College, getCollegesByUniversity } from "../../services/collegeService";
import { deleteMajor, getMajorsByCollege, Major } from "../../services/majorService";

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

  useEffect(() => {
    const fetchColleges = async () => {
      setLoadingColleges(true);
      setError(null);
      try {
        const data = await getCollegesByUniversity(universityId);
        setColleges(data);
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
      alert("يرجى اختيار كلية أولاً لإضافة تخصص.");
      return;
    }
    alert(
      `Add Major for College ${selectedCollegeId} - functionality not implemented yet.`
    );
  };

  const handleEditMajor = (id: string) => {
    alert(`Edit Major ${id} functionality not implemented yet.`);
  };

  const handleDeleteMajor = async (id: string) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التخصص؟")) {
      try {
        setError(null);
        await deleteMajor(id);
        setMajors(majors.filter((m) => m.id !== id));
      } catch (err) {
        setError("فشل في حذف التخصص");
        console.error("Error deleting major:", err);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-700">إدارة التخصصات</h3>
        <button
          onClick={handleAddMajor}
          disabled={!selectedCollegeId}
          className={`bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center ${
            !selectedCollegeId ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة تخصص
        </button>
      </div>

      {loadingColleges && <p>جاري تحميل الكليات...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loadingColleges && colleges.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          يرجى إضافة كلية أولاً لإدارة التخصصات.
        </p>
      )}

      {!loadingColleges && colleges.length > 0 && (
        <div className="mb-4">
          <label
            htmlFor="collegeSelect"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            اختر الكلية لعرض تخصصاتها:
          </label>
          <select
            id="collegeSelect"
            value={selectedCollegeId || ""}
            onChange={(e) => setSelectedCollegeId(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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

      {selectedCollegeId && loadingMajors && <p>جاري تحميل التخصصات...</p>}

      {selectedCollegeId && !loadingMajors && !error && (
        <div className="overflow-x-auto">
          {majors.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
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
                  <tr key={major.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {major.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {major.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium space-x-2 space-x-reverse">
                      <button
                        onClick={() => handleEditMajor(major.id)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="تعديل"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMajor(major.id)}
                        className="text-red-600 hover:text-red-900"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
