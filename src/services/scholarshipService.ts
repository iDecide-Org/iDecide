import axios from "axios";
import { authHeader } from "./authHeader"; // Assuming authHeader exists

// Define the Scholarship interface based on the backend model
// Keep existing Scholarship interface
export interface Scholarship {
  id: string;
  name: string; // Changed from title based on CreateScholarshipDto
  provider: string; // Changed from organization
  type: "كاملة" | "جزئية"; // Match the enum values
  description: string;
  eligibility: string; // Backend expects a string, might need parsing on frontend
  deadline: string; // ISO 8601 format
  link: string;
  coverage?: string[]; // Match backend DTO
  country?: string;
  fieldOfStudy?: string;
  universityId?: string; // Optional or required based on backend logic
  advisorId?: string;
  createdAt?: string;
  // Add other fields if they exist in the backend entity (e.g., amount, image, requirements, views)
  amount?: string;
  image?: string;
  requirements?: string; // Backend expects a string, might need parsing on frontend
  views?: number;
  university?: {
    // Optional: Include if backend sends nested university info
    id: string;
    name: string;
  };
}

// Define the DTO for creating a scholarship, based on backend
// iDecide-API/src/scholarships/dto/create-scholarship.dto.ts
// Keep existing CreateScholarshipDto interface
export interface CreateScholarshipDto {
  name: string;
  provider: string;
  type: "كاملة" | "جزئية";
  description: string;
  eligibility: string;
  deadline: string; // Expect ISO string format
  link: string;
  coverage?: string[];
  country?: string;
  fieldOfStudy?: string;
  universityId: string; // Should be mandatory when creating via advisor dashboard
}

// Define the structure for the scholarship data object to be sent
// Keep existing CreateScholarshipPayload interface (if different from DTO)
// Or ensure CreateScholarshipDto is used directly if payload matches
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
// Keep existing getAllScholarships
export const getAllScholarships = async () => {
  // ... existing code ...
};

export const createScholarship = async (
  scholarshipData: CreateScholarshipDto | CreateScholarshipPayload
) => {
  try {
    const response = await axios.post<Scholarship>(API_URL, scholarshipData, {
      headers: await authHeader(), // Assuming authHeader is defined to include JWT or session info
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating scholarship:", error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Get a single scholarship by ID
// Keep existing getScholarshipById
export const getScholarshipById = async (id: string) => {
  try {
    const response = await axios.get<Scholarship>(`${API_URL}/${id}`, {
      headers: await authHeader(), // Assuming authHeader is defined to include JWT or session info
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching scholarship ${id}:`, error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// For advisors: Get scholarships created by the logged-in advisor
// Keep existing getAdvisorScholarships
export const getAdvisorScholarships = async () => {
  // ... existing code ...
};

// Get scholarships by University ID
export const getScholarshipsByUniversity = async (
  universityId: string
): Promise<Scholarship[]> => {
  try {
    // Use the filter endpoint/params if available, or a specific endpoint
    const response = await axios.get<Scholarship[]>(API_URL, {
      params: { universityId }, // Assuming the backend supports filtering by universityId
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching scholarships for university ${universityId}:`,
      error
    );
    return []; // Return empty array on error
    // throw error;
  }
};

// Update an existing scholarship (for advisors)
// Keep existing updateScholarship
export const updateScholarship = async (
  id: string,
  scholarshipData: Partial<CreateScholarshipPayload> // Or Partial<CreateScholarshipDto>
) => {
  // @Put(':id')
  // // @UseGuards(AuthGuard)
  // async updateScholarship(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body(new ValidationPipe({ skipMissingProperties: true }))
  //   updateScholarshipDto: UpdateScholarshipDto,
  //   @Req() request: Request,
  // ) {
  //   const user = await this.getUserFromRequest(request);
  //   return this.scholarshipsService.updateScholarship(
  //     id,
  //     user,
  //     updateScholarshipDto,
  //   );
  // }

  try {
    const response = await axios.put<Scholarship>(
      `${API_URL}/${id}`,
      scholarshipData,
      {
        headers: await authHeader(), // Assuming authHeader is defined to include JWT or session info
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating scholarship ${id}:`, error);
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Delete a scholarship (for advisors)
export const deleteScholarship = async (id: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: await authHeader(), // Assuming authHeader is defined to include JWT or session info
      withCredentials: true,
    });
    return response.status === 204; // Return true if deletion was successful
  } catch (error) {
    console.error(`Error deleting scholarship ${id}:`, error);
    return false; // Return false on error
  }
};

// Filter scholarships with advanced criteria
// Keep existing filterScholarships
export const filterScholarships = async (params: {
  // ... existing params ...
  universityId?: string; // Ensure universityId is a possible filter param
}) => {
  // ... existing code ...
};
