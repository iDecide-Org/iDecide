// UniversityCard.tsx
import React from "react";
import {
  MapPin,
  Heart,
  Eye,
  GraduationCap,
  Building,
  Clock,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";
import { University, getImageUrl } from "../services/universityService";

interface UniversityCardProps {
  university: University;
  showFavoriteButton?: boolean;
  onFavoriteClick?: () => void;
  isFavorite?: boolean;
}

const UniversityCard: React.FC<UniversityCardProps> = ({
  university,
  showFavoriteButton = false,
  onFavoriteClick,
  isFavorite = false,
}) => {
  const placeholderImageUrl = 'https://via.placeholder.com/300x200?text=No+Image';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = placeholderImageUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full max-w-[350px] hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={getImageUrl(university.image)}
          alt={university.name}
          className="w-full h-48 object-cover"
          onError={handleImageError}
        />
        <div className="absolute top-2 right-2 flex flex-col items-center">
          {showFavoriteButton && (
            <button
              onClick={onFavoriteClick}
              className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "text-red-500 fill-current" : "text-gray-700"
                }`}
              />
            </button>
          )}
          <button className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300 mt-1">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded-md px-2 py-1">
          <span className="flex items-center text-xs text-gray-700">
            <Eye className="w-4 h-4 ml-1" />
            {university.views || "0"} مشاهدة
          </span>
        </div>
        <div className="absolute top-2 left-2 bg-blue-500 text-white rounded-md px-2 py-1">
          <span className="flex items-center text-xs">رائج الان</span>
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 text-right">
          {university.name}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-2 mr-0">
          <MapPin className="w-4 h-4 ml-1" />
          <span className="text-right">{university.location}</span>
        </div>
        <p className="text-gray-600 text-sm mb-2 text-right mr-0">
          {university.type}
        </p>
        <div className="flex items-center justify-between mt-2 mb-4 mr-0">
          <div className="text-gray-600 text-sm flex items-center">
            <Clock className="w-4 h-4 ml-1" />
            <span className="text-right">{new Date(university.createdAt || Date.now()).toLocaleDateString("ar-EG")}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-xs text-gray-600 mr-0">
              <Building className="w-4 h-4 ml-1" />
              <span>{university.collegesCount || 0}+</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 mr-0">
              <GraduationCap className="w-4 h-4 ml-1" />
              <span>{university.majorsCount || 0}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 mr-0">
              <Calendar className="w-4 h-4 ml-1" />
              <span>{university.establishment}</span>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Link to={`/university-details/${university.id}`}>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-md w-full hover:bg-blue-700 transition duration-300">
              عرض تفاصيل
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UniversityCard;
