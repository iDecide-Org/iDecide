import axios from "axios";
import { authHeader } from "./authHeader";
import { University } from "./universityService";

// Define interfaces for favorite items
export interface FavoriteUniversity {
  id: string;
  userId: string;
  universityId: string;
  university: University;
  createdAt?: string;
}

export interface FavoriteScholarship {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarship: any; // Define a proper Scholarship interface if needed
  createdAt?: string;
}

// Base URL for API calls
const API_URL = "http://localhost:3000/api/favorites";

// --- University Favorites ---

// Get all favorite universities for the logged-in user
export const getFavoriteUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}/universities`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite universities:", error);
    throw error;
  }
};

// Add a university to favorites
export const addFavoriteUniversity = async (universityId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/universities/${universityId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error adding university ${universityId} to favorites:`,
      error
    );
    throw error;
  }
};

// Remove a university from favorites
export const removeFavoriteUniversity = async (universityId: string) => {
  try {
    await axios.delete(`${API_URL}/universities/${universityId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(
      `Error removing university ${universityId} from favorites:`,
      error
    );
    throw error;
  }
};

// Check if a specific university is in favorites
export const isUniversityInFavorites = async (
  universityId: string
): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${API_URL}/universities/check/${universityId}`,
      {
        withCredentials: true,
      }
    );
    return response.data.isFavorite;
  } catch (error) {
    console.error(
      `Error checking if university ${universityId} is in favorites:`,
      error
    );
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn(
        "Unauthorized check for favorite status - assuming not favorite."
      );
      return false;
    }
    throw error;
  }
};

// --- Scholarship Favorites ---

// Get all favorite scholarships for the logged-in user
export const getFavoriteScholarships = async () => {
  try {
    const response = await axios.get(`${API_URL}/scholarships`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching favorite scholarships:", error);
    throw error;
  }
};

// Add a scholarship to favorites
export const addFavoriteScholarship = async (scholarshipId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/scholarships/${scholarshipId}`,
      {},
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error adding scholarship ${scholarshipId} to favorites:`,
      error
    );
    throw error;
  }
};

// Remove a scholarship from favorites
export const removeFavoriteScholarship = async (scholarshipId: string) => {
  try {
    await axios.delete(`${API_URL}/scholarships/${scholarshipId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error(
      `Error removing scholarship ${scholarshipId} from favorites:`,
      error
    );
    throw error;
  }
};
