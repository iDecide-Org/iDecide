import axios from 'axios';

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

// Base URL for API calls
const API_URL = 'http://localhost:3000/scholarships';

// Get all scholarships
export const getAllScholarships = async () => {
  try {
    const response = await axios.get<Scholarship[]>(API_URL, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    throw error;
  }
};

// Get a single scholarship by ID
export const getScholarshipById = async (id: string) => {
  try {
    const response = await axios.get<Scholarship>(`${API_URL}/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(`Error fetching scholarship with id ${id}:`, error);
    throw error;
  }
};

// For advisors: Get scholarships created by the logged-in advisor
export const getAdvisorScholarships = async () => {
  try {
    const response = await axios.get<Scholarship[]>(`${API_URL}/advisor`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('Error fetching advisor scholarships:', error);
    throw error;
  }
};

// Create a new scholarship (for advisors)
export const createScholarship = async (scholarshipData: FormData) => {
  try {
    const response = await axios.post<Scholarship>(
      API_URL, 
      scholarshipData, 
      { 
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating scholarship:', error);
    throw error;
  }
};

// Update an existing scholarship (for advisors)
export const updateScholarship = async (id: string, scholarshipData: FormData) => {
  try {
    const response = await axios.put<Scholarship>(
      `${API_URL}/${id}`, 
      scholarshipData, 
      { 
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true 
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating scholarship with id ${id}:`, error);
    throw error;
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
      withCredentials: true 
    });
    return response.data;
  } catch (error) {
    console.error('Error filtering scholarships:', error);
    throw error;
  }
};