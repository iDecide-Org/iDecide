import axios from "axios";
import { authHeader } from "./authHeader"; // Assuming authHeader exists

// Define the Major interface
export interface Major {
  id: string;
  name: string;
  description?: string;
  collegeId: string;
  college?: {
    // Optional: Include if backend sends nested college info
    id: string;
    name: string;
  };
  // Add other fields as needed based on your backend Major entity
}

const API_URL = "http://localhost:3000/api/majors"; // Adjust if your API URL is different

// Get majors by College ID
export const getMajorsByCollege = async (
  collegeId: string
): Promise<Major[]> => {
  try {
    const response = await axios.get<Major[]>(API_URL, {
      params: { collegeId },
      withCredentials: true, // Include cookies if needed for auth
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching majors for college ${collegeId}:`, error);
    // Return empty array or throw error based on how you want to handle errors
    return [];
    // throw error;
  }
};

// --- Placeholder CRUD functions ---

// Create a new major (requires authentication)
export const createMajor = async (
  majorData: Omit<Major, "id" | "college">
): Promise<Major> => {
  try {
    const response = await axios.post<Major>(API_URL, majorData, {
      headers: await authHeader(), // Add auth header
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating major:", error);
    throw error; // Rethrow to be handled by the component
  }
};

// Update an existing major (requires authentication)
export const updateMajor = async (
  id: string,
  majorData: Partial<Omit<Major, "id" | "collegeId" | "college">>
): Promise<Major> => {
  try {
    const response = await axios.patch<Major>(`${API_URL}/${id}`, majorData, {
      headers: await authHeader(), // Add auth header
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating major ${id}:`, error);
    throw error; // Rethrow to be handled by the component
  }
};

// Delete a major (requires authentication)
export const deleteMajor = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: await authHeader(), // Add auth header
      withCredentials: true,
    });
  } catch (error) {
    console.error(`Error deleting major ${id}:`, error);
    throw error; // Rethrow to be handled by the component
  }
};
