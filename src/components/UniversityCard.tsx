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
import { Link } from "react-router";

interface UniversityCardProps {
  university: {
    id: number;
    name: string;
    location: string;
    type: string;
    image: string;
    views: string;
    date: string;
    colleges: string;
    majors: string;
    establishment: string;
  };
}

const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col w-full max-w-[350px] hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={university.image}
          alt={university.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col items-center">
          <button className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300">
            <Heart className="w-5 h-5 text-gray-700" />
          </button>
          <button className="bg-white bg-opacity-70 rounded-full p-1 hover:bg-opacity-100 transition duration-300 mt-1">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </button>
        </div>
        <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded-md px-2 py-1">
          <span className="flex items-center text-xs text-gray-700">
            <Eye className="w-4 h-4 ml-1" />
            {university.views} مشاهدة
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
            <span className="text-right">{university.date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="flex items-center text-xs text-gray-600 mr-0">
              <Building className="w-4 h-4 ml-1" />
              <span>{university.colleges}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 mr-0">
              <GraduationCap className="w-4 h-4 ml-1" />
              <span>{university.majors}</span>
            </div>
            <div className="flex items-center text-xs text-gray-600 mr-0">
              <Calendar className="w-4 h-4 ml-1" />
              <span>{university.establishment}</span>
            </div>
          </div>
        </div>
        <div className="mt-auto">
          <Link to="/university-details">
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
