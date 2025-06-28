import axios from "axios";
import Cookies from "js-cookie";

export const apiClient = axios.create({
  baseURL: "http://localhost:8000", 
});

apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});



export const apiLogin = async (username: string, password: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await apiClient.post("/auth/token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token } = response.data;
    if (!access_token) {
      throw new Error("No access token received");
    }
    return access_token;
  } catch (error: any) {
    throw new Error(JSON.stringify(error.response?.data?.detail) || "Login failed");
  }
};


export const apiRegister = async (username: string,  password: string) => {
  try {
    const response = await apiClient.post("/auth/register", {
      username,
      password,
    });
    return response.data; 
  } 
  catch (error: any) {
    if (error.response?.data?.detail) {
      const errors = error.response.data.detail;
      for (const err of errors) {
        if (err.loc.includes("email") && err.type === "value_error") {
          throw new Error("Invalid email");
        }
      }
    }
    throw new Error("Registration failed");
  }
};


export const fetchPosts = () => apiClient.get("/posts/");

interface CreatePostData {
  title: string;
  content: string;
}

export const createPost = async (data: CreatePostData) => {
  try {
    const response = await apiClient.post("/posts/", data);
    return response.data; 
  } catch (error) {
    console.error("Ошибка при создании поста:", error);
    throw error;
  }
};

export const updatePost = async (postId: number, data: { title: string; content: string }) => {
  try {
    const response = await apiClient.put(`/posts/${postId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
};

export const deletePost = async (postId: number) => {
  try {
    await apiClient.delete(`/posts/${postId}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// types.ts (создайте новый файл для типов)
export interface AvatarResponse {
  message?: string;
  error?: string;
}

// apiClient.ts
export const uploadAvatar = async (file: File): Promise<AvatarResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiClient.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to upload avatar");
  }
};

export const getAvatar = async (): Promise<Blob> => {
  try {
    const response = await apiClient.get("/users/avatar", {
      responseType: "blob",
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Avatar not found");
  }
};

export const deleteAvatar = async (): Promise<void> => {
  try {
    await apiClient.delete("/users/avatar");
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to delete avatar");
  }
};