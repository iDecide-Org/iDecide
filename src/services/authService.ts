export const requestPasswordReset = async (email: string): Promise<string> => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset link.");
    }

    return data.message; // Return the success message from the backend
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error; // Re-throw to be caught in the component
  }
};

// --- Reset Password ---
export const resetPassword = async (
  token: string,
  password: string
): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reset password.");
    }

    return data.message; // Return the success message from the backend
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error; // Re-throw to be caught in the component
  }
};
