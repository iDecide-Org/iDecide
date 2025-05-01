import axios from "axios";
import { authHeader } from "./authHeader";
import { Major } from "./majorService";

const API_URL = "http://localhost:3000/api/colleges";

export interface College {
  id: string;
  name: string;
  description: string | null; // Allow null for description as well if backend allows
  location?: string | null; // Change to string | null
  website?: string | null; // Change to string | null
  universityId: string;
  university?: {
    id: string;
    name: string;
    advisorId?: string;
    image?: string;
  };
  majors?: Major[];
}

// Define the type for data sent when creating a college
// Ensure it matches the expected backend DTO (CreateCollegeDto)
export type CreateCollegePayload = Omit<
  College,
  "id" | "university" | "majors"
>;

// Define the type for data sent when updating a college
// Ensure it matches the expected backend DTO (UpdateCollegeDto)
export type UpdateCollegePayload = Partial<
  Omit<College, "id" | "universityId" | "university" | "majors">
>;

// Get all colleges (optional: filter by university)
export const getColleges = async (
  universityId?: string
): Promise<College[]> => {
  try {
    const response = await axios.get<College[]>(API_URL, {
      params: universityId ? { universityId } : {},
      withCredentials: true, // If needed for public/private routes
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error;
  }
};

// Get colleges specifically for a university (often used in advisor context)
export const getCollegesByUniversity = async (
  universityId: string
): Promise<College[]> => {
  try {
    const response = await axios.get<College[]>(API_URL, {
      params: { universityId },
      headers: await authHeader(), // Assume protected endpoint for advisor context
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching colleges for university ${universityId}:`,
      error
    );
    throw error;
  }
};

// Get a single college by ID
export const getCollegeById = async (id: string): Promise<College> => {
  try {
    const response = await axios.get<College>(`${API_URL}/${id}`, {
      headers: await authHeader(), // Assume protected endpoint
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching college ${id}:`, error);
    throw error;
  }
};

// Create a new college (requires authentication)
export const createCollege = async (
  collegeData: CreateCollegePayload // Use the defined payload type
): Promise<College> => {
  try {
    const response = await axios.post<College>(API_URL, collegeData, {
      headers: await authHeader(),
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating college:", error);
    throw error;
  }
};

// Update an existing college (requires authentication)
export const updateCollege = async (
  id: string,
  collegeData: UpdateCollegePayload // Use the defined payload type
): Promise<College> => {
  try {
    const response = await axios.patch<College>(
      `${API_URL}/${id}`,
      collegeData,
      {
        headers: await authHeader(),
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating college ${id}:`, error);
    throw error;
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
    throw error;
  }
};
