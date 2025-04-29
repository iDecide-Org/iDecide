import axios from "axios";

// Define the Scholarship interface based on the backend model
export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  description: string;
  amount: string;
  deadline: string;
  location: string;
  type: string;
  image: string;
  eligibility: string[];
  requirements: string[];
  applicationLink: string;
  views?: string;
  advisorId?: string;
  createdAt?: string;
}

// Define the DTO for creating a scholarship, based on backend
// iDecide-API/src/scholarships/dto/create-scholarship.dto.ts
export interface CreateScholarshipDto {
  name: string;
  provider: string;
  type: "كاملة" | "جزئية"; // Matches ScholarshipType enum
  description: string;
  eligibility: string;
  deadline: string; // Will be ISO string
  link: string;
  coverage?: ("رسوم دراسية" | "مصاريف معيشة" | "سفر" | "أخرى")[]; // Matches ScholarshipCoverage enum
  country?: string;
  fieldOfStudy?: string;
  universityId: string;
  // Note: Backend DTO might have more fields (e.g., amount, location, image) handled differently (e.g., via FormData)
}

// Define the structure for the scholarship data object to be sent
export interface CreateScholarshipPayload {
  name: string;
  provider: string;
  type: "كاملة" | "جزئية"; // Match the enum values
  description: string;
  eligibility: string; // Backend expects a string
  deadline: string; // ISO 8601 format
  link: string;
  coverage?: string[]; // Match backend DTO
  country?: string;
  fieldOfStudy?: string;
  universityId: string;
}

// Base URL for API calls
const API_URL = "http://localhost:3000/api/scholarships";

// Get all scholarships
export const getAllScholarships = async () => {
  try {
    const response = await axios.get<Scholarship[]>(API_URL, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};

// Get a single scholarship by ID
export const getScholarshipById = async (id: string) => {
  try {
    const response = await axios.get<Scholarship>(`${API_URL}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching scholarship with id ${id}:`, error);
    throw error;
  }
};

// For advisors: Get scholarships created by the logged-in advisor
export const getAdvisorScholarships = async () => {
  try {
    const response = await axios.get<Scholarship[]>(`${API_URL}/advisor`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching advisor scholarships:", error);
    throw error;
  }
};

// Create a new scholarship (for advisors)
// Expects a plain JavaScript object matching CreateScholarshipPayload
export const createScholarship = async (
  scholarshipData: CreateScholarshipPayload
) => {
  try {
    // Send as JSON
    const response = await axios.post<Scholarship>(API_URL, scholarshipData, {
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating scholarship:", error);
    // Rethrow for component to handle
    if (axios.isAxiosError(error)) {
      // Provide more specific error info if available
      throw new Error(
        error.response?.data?.message || "Failed to create scholarship"
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Update an existing scholarship (for advisors)
// Expects a plain JavaScript object
export const updateScholarship = async (
  id: string,
  scholarshipData: Partial<CreateScholarshipPayload> // Use Partial for updates
) => {
  try {
    const response = await axios.put<Scholarship>(
      `${API_URL}/${id}`,
      scholarshipData,
      {
        headers: { "Content-Type": "application/json" }, // Set content type to JSON
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating scholarship with id ${id}:`, error);
    // Rethrow for component to handle
    if (axios.isAxiosError(error)) {
      // Provide more specific error info if available
      throw new Error(
        error.response?.data?.message || `Failed to update scholarship ${id}`
      );
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// Delete a scholarship (for advisors)
export const deleteScholarship = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/${id}`, { withCredentials: true });
    return true; // Return true on successful deletion
  } catch (error) {
    console.error(`Error deleting scholarship with id ${id}:`, error);
    throw error;
  }
};

// Filter scholarships with advanced criteria
export const filterScholarships = async (params: {
  title?: string;
  type?: string;
  location?: string;
  deadline?: string;
}) => {
  try {
    const response = await axios.get<Scholarship[]>(API_URL, {
      params,
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error filtering scholarships:", error);
    throw error;
  }
};
