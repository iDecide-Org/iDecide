import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, ChevronLeft, AlertTriangle, Check } from "lucide-react";
import Navbar from "../../NavBar";
import Footer from "../../Footer";
import { createUniversity } from "../../../services/universityService";
import { useAuth } from "../../../contexts/useAuth";
import axios from "axios"; // Import axios to check error details

// Define type for SPARQL results
interface SparqlResult {
  univ: { value: string };
  enLabel?: { value: string };
  arLabel?: { value: string };
}

const AddUniversity: React.FC = () => {
  const navigate = useNavigate();
  const { isAdvisor } = useAuth();

  const [universityData, setUniversityData] = useState({
    name: "",
    type: "",
    location: "",
    description: "",
    establishment: new Date().getFullYear().toString(),
    collegesCount: "1",
    majorsCount: "1",
  });

  const [image, setImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [universitySuggestions, setUniversitySuggestions] = useState<
    SparqlResult[]
  >([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Check if user is advisor
  useEffect(() => {
    if (!isAdvisor) {
      navigate("/");
    }
  }, [isAdvisor, navigate]);

  // Fetch university suggestions from Wikidata
  useEffect(() => {
    const fetchUniversitySuggestions = async () => {
      setLoadingSuggestions(true);
      const sparqlQuery = `
        SELECT ?univ ?enLabel ?arLabel WHERE {
          ?univ wdt:P31 wd:Q3918;         # instance of University
                 wdt:P17 wd:Q79.          # country = Egypt

          OPTIONAL {
            ?univ rdfs:label ?enLabel .
            FILTER(LANG(?enLabel) = "en")
          }

          OPTIONAL {
            ?univ rdfs:label ?arLabel .
            FILTER(LANG(?arLabel) = "ar")
          }
        }
      `;
      const endpointUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
        sparqlQuery
      )}&format=json`;

      try {
        const response = await fetch(endpointUrl, {
          headers: {
            Accept: "application/sparql-results+json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filter results to include only those with an Arabic label
        const resultsWithArLabel = data.results.bindings.filter(
          (result: SparqlResult) => result.arLabel?.value
        );
        setUniversitySuggestions(resultsWithArLabel);
      } catch (err) {
        console.error("Error fetching university suggestions:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchUniversitySuggestions();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setUniversityData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);
    setSuccess(null); // Clear previous success message

    try {
      // Create FormData object for file upload
      const formData = new FormData();

      // Append text fields
      Object.entries(universityData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append image
      if (image) {
        formData.append("image", image);
      }
      // Create university
      const newUniversity = await createUniversity(formData);
      setSuccess("تم إضافة الجامعة بنجاح");

      // Clear form after successful submission
      setUniversityData({
        name: "",
        type: "",
        location: "",
        description: "",
        establishment: new Date().getFullYear().toString(),
        collegesCount: "1",
        majorsCount: "1",
      });
      setImage(null);

      // Navigate to the university list after a brief delay
      setTimeout(() => {
        navigate(`/universities/edit/${newUniversity.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error creating university:", err);
      // Check if the error is an Axios error and has a 400 status
      if (axios.isAxiosError(err) && err.response?.status === 400) {
        // Check if the error message indicates invalid name (optional but more specific)
        const errorMessage = err.response?.data?.message;
        if (
          typeof errorMessage === "string" &&
          errorMessage.includes("not a recognized university")
        ) {
          setError("اسم الجامعة غير صحيح");
        } else {
          // Handle other 400 errors if necessary
          setError("فشل في إضافة الجامعة: خطأ في البيانات المدخلة");
        }
      } else {
        // Generic error for other issues (network, server error, etc.)
        setError("فشل في إضافة الجامعة");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-600 text-white">
            <h1 className="text-2xl font-bold text-right">إضافة جامعة جديدة</h1>
          </div>

          {error && (
            <div className="m-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <p>{error}</p> {/* Error message is now dynamic */}
            </div>
          )}

          {success && (
            <div className="m-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* University Name */}
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  اسم الجامعة *{" "}
                  {loadingSuggestions && "(جاري تحميل الاقتراحات...)"}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={universityData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                  list="university-suggestions" // Link input to datalist
                  placeholder="ابدا بالكتابة للاقتراحات..."
                  autoComplete="off" // Add this line to disable browser autocomplete
                />
                <datalist id="university-suggestions">
                  {universitySuggestions.map((suggestion) => (
                    <option
                      key={suggestion.univ.value}
                      value={suggestion.arLabel?.value} // Use Arabic label as the value
                    >
                      {/* Optionally display English label as well */}
                      {/* {suggestion.enLabel?.value ? ` (${suggestion.enLabel.value})` : ''} */}
                    </option>
                  ))}
                </datalist>
              </div>

              {/* University Type */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  نوع الجامعة *
                </label>
                <select
                  name="type"
                  required
                  value={universityData.type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">اختر نوع الجامعة</option>
                  <option value="حكومية">حكومية</option>
                  <option value="خاصة">خاصة</option>
                  <option value="أهلية">أهلية</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  الموقع *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={universityData.location}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Establishment Year */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  سنة التأسيس *
                </label>
                <input
                  type="number"
                  name="establishment"
                  required
                  min="1800"
                  max={new Date().getFullYear()}
                  value={universityData.establishment}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Colleges Count */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  عدد الكليات *
                </label>
                <input
                  type="number"
                  name="collegesCount"
                  required
                  min="1"
                  value={universityData.collegesCount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Majors Count */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  عدد التخصصات *
                </label>
                <input
                  type="number"
                  name="majorsCount"
                  required
                  min="1"
                  value={universityData.majorsCount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  وصف الجامعة *
                </label>
                <textarea
                  name="description"
                  required
                  rows={5}
                  value={universityData.description}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-semibold mb-2 text-right">
                  صورة الجامعة
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
                    className="bg-blue-50 text-blue-600 py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-100 inline-block"
                  >
                    اختيار صورة
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    {image
                      ? `تم اختيار: ${image.name}`
                      : "يرجى اختيار صورة للجامعة"}
                  </p>
                  {image && (
                    <div className="mt-4 max-h-60 overflow-hidden">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="h-full w-auto mx-auto object-contain rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => navigate("/universities/manage")}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
              >
                <ChevronLeft className="w-5 h-5 ml-1" />
                العودة
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
                ) : (
                  <Save className="w-5 h-5 ml-2" />
                )}
                إضافة الجامعة
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AddUniversity;
