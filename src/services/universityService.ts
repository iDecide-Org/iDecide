import axios from "axios";
import { authHeader } from "./authHeader";

const API_URL = "http://localhost:3000/api";

export interface University {
  id: string;
  name: string;
  nameAr?: string;
  location: string;
  description: string;
  website?: string;
  tuitionFees?: string;
  admissionRequirements?: string;
  image?: string; // Changed from imageUrl to image
  majors?: string[];
  advisorId?: string;
  type?: string;
  establishment?: number;
  collegesCount?: number;
  majorsCount?: number;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
  advisorName?: string;
  advisor?: {
    id: string;
    name: string;
  };
}

// Get all universities
export const getAllUniversities = async (
  page = 1,
  limit = 10,
  filters = {}
): Promise<{ universities: University[]; totalCount: number }> => {
  try {
    const response = await axios.get(`${API_URL}/universities`, {
      params: { page, limit, ...filters },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching universities:", error);
    throw error;
  }
};

// Get university by ID
export const getUniversityById = async (id: string): Promise<University> => {
  try {
    const response = await axios.get(`${API_URL}/universities/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching university with ID ${id}:`, error);
    throw error;
  }
};

// Get universities created by the logged-in advisor
export const getAdvisorUniversities = async (): Promise<University[]> => {
  try {
    const response = await axios.get(`${API_URL}/universities/advisor`, {
      withCredentials: true,
    });
    // Ensure the response data is always an array
    const data = response.data;
    if (!data) {
      return []; // Return empty array if data is null/undefined
    }
    if (!Array.isArray(data)) {
      return [data]; // Wrap single object in an array
    }
    return data; // Return the array if it's already an array
  } catch (error) {
    console.error("Error fetching advisor universities:", error);
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Unauthorized: JWT cookie likely missing or invalid.");
    }
    // Return empty array on error to prevent crashes in the component
    return [];
    // throw error; // Or re-throw if you want the component to handle the error state explicitly
  }
};

// Create a new university (for advisors)
export const createUniversity = async (
  universityData: FormData
): Promise<University> => {
  try {
    const response = await axios.post(
      `${API_URL}/universities`,
      universityData,
      {
        headers: {
          ...(await authHeader()),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating university:", error);
    throw error;
  }
};

// Update university (for advisors)
export const updateUniversity = async (
  id: string,
  universityData: FormData
): Promise<University> => {
  try {
    const response = await axios.patch(
      `${API_URL}/universities/${id}`,
      universityData,
      {
        headers: {
          ...(await authHeader()),
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating university with ID ${id}:`, error);
    throw error;
  }
};

// Delete university (for advisors)
export const deleteUniversity = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/universities/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting university with ID ${id}:`, error);
    throw error;
  }
};

// Helper to get image URL
export const getImageUrl = (
  imageFileName: string | null | undefined
): string => {
  if (!imageFileName) {
    return "https://via.placeholder.com/300x200?text=No+Image";
  }

  // If it's already a full URL (e.g., from external source or already processed)
  if (imageFileName.startsWith("http") || imageFileName.startsWith("/")) {
    return imageFileName;
  }

  // Construct URL for backend-served images
  const baseUrl = API_URL.replace("/api", "");
  return `${baseUrl}/uploads/universities/${imageFileName}`;
};
