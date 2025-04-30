import axios from "axios";
import { authHeader } from "./authHeader"; // Assuming authHeader exists

// Define the College interface based on the backend entity
export interface College {
  id: string;
  name: string;
  description?: string;
  universityId: string;
  university?: {
    // Optional: Include if backend sends nested university info
    id: string;
    name: string;
  };
  majors?: Major[]; // Optional: Include if backend sends nested majors info
  // Add other fields as needed based on your backend College entity
}

// Define the Major interface (can be moved to majorService.ts later)
export interface Major {
  id: string;
  name: string;
  description?: string;
  collegeId: string;
  // Add other fields as needed
}

const API_URL = "http://localhost:3000/api/colleges"; // Adjust if your API URL is different

// Get colleges by University ID
export const getCollegesByUniversity = async (
  universityId: string
): Promise<College[]> => {
  try {
    const response = await axios.get<College[]>(API_URL, {
      params: { universityId },
      withCredentials: true, // Include cookies if needed for auth
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching colleges for university ${universityId}:`,
      error
    );
    // Return empty array or throw error based on how you want to handle errors
    return [];
    // throw error;
  }
};

// --- Placeholder CRUD functions ---

// Create a new college (requires authentication)
export const createCollege = async (
  collegeData: Omit<College, "id" | "university" | "majors">
): Promise<College> => {
  try {
    const response = await axios.post<College>(API_URL, collegeData, {
      headers: await authHeader(), // Add auth header
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating college:", error);
    throw error; // Rethrow to be handled by the component
  }
};

// Update an existing college (requires authentication)
export const updateCollege = async (
  id: string,
  collegeData: Partial<
    Omit<College, "id" | "universityId" | "university" | "majors">
  >
): Promise<College> => {
  try {
    const response = await axios.patch<College>(
      `${API_URL}/${id}`,
      collegeData,
      {
        headers: await authHeader(), // Add auth header
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating college ${id}:`, error);
    throw error; // Rethrow to be handled by the component
  }
};

// Delete a college (requires authentication)
export const deleteCollege = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: await authHeader(), // Add auth header
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting college ${id}:`, error);
    throw error; // Rethrow to be handled by the component
  }
};
