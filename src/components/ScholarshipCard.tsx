import React from "react";
import { MapPin, BookOpen, Eye, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Scholarship } from "../services/scholarshipService";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  showSaveButton?: boolean;
  onSaveClick?: () => void;
  isSaved?: boolean;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  scholarship,
  showSaveButton = false,
  onSaveClick,
  isSaved = false,
}) => {
  const formatDeadline = (dateString: string | undefined) => {
    if (!dateString) return "غير محدد";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "تاريخ غير صالح";
      }
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "تاريخ غير صالح";
    }
  };

  const imageUrl =
    scholarship.image ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2071&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="relative">
        <img
          src={imageUrl}
          alt={scholarship.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
          {showSaveButton && (
            <button
              onClick={onSaveClick}
              className="bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 transition duration-300"
            >
              <BookOpen
                className={`w-5 h-5 ${
                  isSaved ? "text-blue-500 fill-current" : "text-gray-700"
                }`}
              />
            </button>
          )}
        </div>
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded-md px-2 py-1">
          <span className="flex items-center text-xs text-gray-700">
            <Eye className="w-4 h-4 ml-1" />
            {scholarship.views ?? 0} مشاهدة
          </span>
        </div>
        <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-md px-2 py-1">
          <span className="flex items-center text-xs">{scholarship.type}</span>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-right line-clamp-2">
          {scholarship.name}
        </h3>
        <div className="flex items-center justify-end text-gray-600 text-sm mb-2">
          <span className="text-right">{scholarship.provider}</span>
        </div>
        <p className="text-gray-600 text-sm mb-4 text-right line-clamp-2">
          {scholarship.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-end text-gray-600 text-sm">
            <span className="text-right line-clamp-1">
              {scholarship.country || "غير محدد"}
            </span>
            <MapPin className="w-4 h-4 ml-1 flex-shrink-0" />
          </div>
          <div className="flex items-center justify-end text-gray-600 text-sm">
            <span className="text-right">{scholarship.amount || "N/A"}</span>
            <DollarSign className="w-4 h-4 ml-1 flex-shrink-0" />
          </div>
          <div className="flex items-center justify-end text-gray-600 text-sm">
            <span className="text-right">
              آخر موعد: {formatDeadline(scholarship.deadline)}
            </span>
            <Clock className="w-4 h-4 ml-1 flex-shrink-0" />
          </div>
        </div>

        <div className="mt-auto">
          <Link to={`/scholarships/${scholarship.id}`} state={{ scholarship }}>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition duration-300">
              عرض التفاصيل
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
