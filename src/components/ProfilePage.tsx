import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  UserCircle,
  LogOut,
  MessageSquare,
  Heart,
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";
import Navbar from "./NavBar";
import UniversityCard from "./UniversityCard";
import ChatInterface from "./ChatInterface";
import axios from "axios";
import { University as ServiceUniversity } from "../services/universityService";

interface FavoriteUniversity {
  id: string;
  userId: string;
  universityId: string;
  university: ServiceUniversity;
}

interface ProfileFormData {
  name: string;
  email: string;
  password?: string;
  dateOfBirth?: string;
  government?: string;
  district?: string;
  city?: string;
  phoneNumber?: string;
  gender?: string;
  preferredCommunication?: string;
  certificateType?: string;
  totalScore?: number;
  nationality?: string;
}

const ProfilePage: React.FC = () => {
  const { user, userName, email, handleLogout, userType, fetchUser } =
    useAuth();
  console.log("this is user", user);

  // i want to conver DateOfBirth to string and set it to the form
  // loData

  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProfileFormData>({
    name: userName || "",
    email: email || "",
    password: "",
    // convert DateOfBirth to string
    dateOfBirth: user?.DateOfBirth
      ? new Date(user.DateOfBirth).toISOString().split("T")[0]
      : undefined,
    government: user?.Government || "",
    district: user?.District || "",
    city: user?.city || "",
    phoneNumber: user?.phoneNumber || "",
    gender: user?.gender || "",
    preferredCommunication: user?.preferredCommunication || "",
    // i want here conditionally set the values based on userType
    certificateType:
      userType === "student" ? user?.certificateType || "" : undefined,
    totalScore: user?.totalScore || undefined,
    nationality: user?.nationality || "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [likedUniversities, setLikedUniversities] = useState<
    FavoriteUniversity[]
  >([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [favoritesError, setFavoritesError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("profile");

  const fetchFavorites = useCallback(async () => {
    setIsLoadingFavorites(true);
    setFavoritesError(null);
    try {
      const response = await axios.get<FavoriteUniversity[]>(
        "http://localhost:3000/api/favorites/universities",
        { withCredentials: true }
      );
      setLikedUniversities(response.data);
    } catch (error) {
      setFavoritesError("فشل في تحميل المفضلة.");
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoadingFavorites(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "favorites") {
      fetchFavorites();
    }
  }, [activeTab, fetchFavorites]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEditing(true);
    setUpdateSuccess(null);
    setUpdateError(null);
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : parseFloat(value),
    }));
    setIsEditing(true);
    setUpdateSuccess(null);
    setUpdateError(null);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateSuccess(null);
    setUpdateError(null);

    const payload: Partial<ProfileFormData> = { ...formData };
    if (!payload.password) {
      delete payload.password;
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/api/auth/profile",
        payload,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUpdateSuccess("تم تحديث الملف الشخصي بنجاح!");
        setIsEditing(false);
        await fetchUser();
        setTimeout(() => setUpdateSuccess(null), 3000);
      } else {
        setUpdateError(response.data.message || "فشل تحديث الملف الشخصي.");
      }
    } catch (error) {
      let message = "فشل تحديث الملف الشخصي.";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data.message || message;
      }
      setUpdateError(message);
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromFavorites = useCallback(
    async (universityId: string) => {
      setLikedUniversities((prev) =>
        prev.filter((fav) => fav.universityId !== universityId)
      );

      try {
        await axios.delete(
          `http://localhost:3000/api/favorites/universities/${universityId}`,
          { withCredentials: true }
        );
      } catch (error) {
        setFavoritesError("فشل في إزالة الجامعة من المفضلة.");
        console.error(
          `Error removing university ${universityId} from favorites:`,
          error
        );
        fetchFavorites();
      }
    },
    [fetchFavorites]
  );

  const handleLogoutClick = useCallback(async () => {
    await handleLogout();
    navigate("/");
  }, [handleLogout, navigate]);

  const sidebarItems = [
    { name: "profile", label: "حسابي الشخصي", icon: <UserCircle size={20} /> },
    { name: "chat", label: "محادثاتي", icon: <MessageSquare size={20} /> },
    { name: "favorites", label: "المفضلة", icon: <Heart size={20} /> },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <aside className="bg-white p-6 w-64 border-r border-gray-200 shadow-lg">
          <div className="mb-6 text-center">
            <div className="relative">
              <div className="flex flex-col items-center space-y-2 text-gray-700 focus:outline-none">
                <UserCircle className="w-16 h-16 text-blue-600" />
                <div className="font-bold text-lg">{userName}</div>
                <div className="text-sm text-gray-500">{email}</div>
              </div>
            </div>
          </div>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <button
                  className={`flex items-center space-x-2 w-full p-3 rounded-md text-right justify-end ${
                    activeTab === item.name
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  onClick={() => setActiveTab(item.name)}
                >
                  <span>{item.label}</span>
                  {item.icon}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleLogoutClick}
                className="flex items-center mt-6 space-x-2 p-3 rounded-md w-full justify-end text-gray-700 hover:bg-red-50 hover:text-red-600 transition duration-200 focus:outline-none"
              >
                <span>تسجيل الخروج</span>
                <LogOut className="w-5 h-5" />
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-8">
          <div className="container mx-auto">
            {activeTab === "chat" ? (
              <ChatInterface />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-right">
                  {sidebarItems.find((item) => item.name === activeTab)
                    ?.label || "الصفحة الشخصية"}
                </h2>

                {updateSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-end">
                    <span>{updateSuccess}</span>
                    <Check className="w-5 h-5 mr-2" />
                  </div>
                )}
                {updateError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-end">
                    <span>{updateError}</span>
                    <AlertTriangle className="w-5 h-5 mr-2" />
                  </div>
                )}

                {activeTab === "profile" && (
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2 text-right"
                      >
                        الاسم بالكامل
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-right"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2 text-right"
                      >
                        البريد الالكتروني
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-right"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2 text-right"
                      >
                        كلمة السر (اتركها فارغة لعدم التغيير)
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="********"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-right"
                        dir="rtl"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dateOfBirth"
                        className="block text-sm font-medium text-gray-700 mb-2 text-right"
                      >
                        تاريخ الميلاد
                      </label>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 text-right"
                        dir="rtl"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label
                          htmlFor="government"
                          className="block text-sm font-medium text-gray-700 mb-2 text-right"
                        >
                          المحافظة
                        </label>
                        <input
                          type="text"
                          id="government"
                          name="government"
                          value={formData.government}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="district"
                          className="block text-sm font-medium text-gray-700 mb-2 text-right"
                        >
                          المركز/الحي
                        </label>
                        <input
                          type="text"
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700 mb-2 text-right"
                        >
                          المدينة/القرية
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                          dir="rtl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phoneNumber"
                          className="block text-sm font-medium text-gray-700 mb-2 text-right"
                        >
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                          dir="rtl"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="gender"
                          className="block text-sm font-medium text-gray-700 mb-2 text-right"
                        >
                          النوع
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                          dir="rtl"
                        >
                          <option value="">اختر</option>
                          <option value="male">ذكر</option>
                          <option value="female">انثى</option>
                        </select>
                      </div>
                    </div>

                    {userType === "student" && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label
                              htmlFor="certificateType"
                              className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            >
                              نوع الشهادة
                            </label>
                            <select
                              id="certificateType"
                              name="certificateType"
                              value={formData.certificateType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                              dir="rtl"
                            >
                              <option value="">اختر</option>
                              <option value="egyptian_high_school">
                                شهادة الثانوية المصرية
                              </option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="totalScore"
                              className="block text-sm font-medium text-gray-700 mb-2 text-right"
                            >
                              المجموع/النسبة
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              id="totalScore"
                              name="totalScore"
                              value={formData.totalScore ?? ""}
                              onChange={handleNumberInputChange}
                              placeholder="0.00"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                              dir="rtl"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="nationality"
                            className="block text-sm font-medium text-gray-700 mb-2 text-right"
                          >
                            الجنسية
                          </label>
                          <input
                            type="text"
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                            dir="rtl"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label
                        htmlFor="preferredCommunication"
                        className="block text-sm font-medium text-gray-700 mb-2 text-right"
                      >
                        أفضل طريقة للتواصل؟
                      </label>
                      <select
                        id="preferredCommunication"
                        name="preferredCommunication"
                        value={formData.preferredCommunication}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md text-right"
                        dir="rtl"
                      >
                        <option value="">اختر</option>
                        <option value="phone">هاتف</option>
                        <option value="email">بريد إلكتروني</option>
                        <option value="whatsapp">واتساب</option>
                      </select>
                    </div>

                    <div className="flex justify-start pt-4">
                      <button
                        type="submit"
                        disabled={!isEditing || isSubmitting}
                        className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin ml-2" />
                            جاري الحفظ...
                          </>
                        ) : (
                          "حفظ التغييرات"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {activeTab === "favorites" && (
                  <div className="space-y-6">
                    {favoritesError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center justify-end">
                        <span>{favoritesError}</span>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                      </div>
                    )}

                    {isLoadingFavorites ? (
                      <div className="flex justify-center items-center py-16">
                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        <span className="ml-2 text-gray-600">
                          جاري تحميل المفضلة...
                        </span>
                      </div>
                    ) : likedUniversities.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                          لا توجد جامعات في المفضلة
                        </h3>
                        <p className="text-gray-500 mb-6">
                          ابدأ في استكشاف الجامعات وأضف ما يعجبك إلى المفضلة
                        </p>
                        <Link
                          to="/universities"
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                        >
                          استكشف الجامعات
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {likedUniversities.map((fav) => (
                          <div key={fav.id} className="relative group">
                            <UniversityCard
                              university={fav.university}
                              showFavoriteButton={true}
                              onFavoriteClick={() =>
                                handleRemoveFromFavorites(fav.universityId)
                              }
                              isFavorite={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
