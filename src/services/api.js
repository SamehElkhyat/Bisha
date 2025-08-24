// API service for connecting to Bisha Chamber backend
// Base URL for the API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://bisha.runasp.net";

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // If we have an auth token, add it to the headers
  const token = localStorage.getItem("auth_token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Check if response has content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  login: async (credentials) => {
    console.log(credentials);
    return fetchAPI("/api/Login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return fetchAPI("/api/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
};

// News APIs
export const newsAPI = {
  getAll: async (pageNumber = 1) => {
    return fetchAPI(`/api/NewsPaper/Get-All/${pageNumber}`);
  },

  getById: async (id) => {
    return fetchAPI(`/api/NewsPaper/Get-All-Circulars-ByID/${id}`);
  },

  getAllCirculars: async (pageNumber = 1) => {
    return fetchAPI(`/api/NewsPaper/Get-All-Circulars/${pageNumber}`);
  },

  getCircularById: async (id) => {
    return fetchAPI(`/api/NewsPaper/Get-All-Circulars-ByID/${id}`);
  },

  create: async (newsData) => {
    return fetchAPI("/api/NewsPaper/Add", {
      method: "POST",
      body: JSON.stringify(newsData), 
    });
  },

  UpdateNews: async (newData, id) => {
    return fetchAPI(`/api/NewsPaper/Update/${id}`, {
      method: "POST",
      body: JSON.stringify(newData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/api/NewsPaper/Delete/${id}`, {
      method: "DELETE",
    });
  },
};

// Clients APIs
export const clientsAPI = {
  getAll: async () => {
    return fetchAPI("/api/Clients");
  },

  getById: async (id) => {
    return fetchAPI(`/api/Clients/${id}`);
  },

  create: async (clientData) => {
    return fetchAPI("/api/Clients", {
      method: "POST",
      body: JSON.stringify(clientData),
    });
  },

  update: async (id, clientData) => {
    return fetchAPI(`/api/Clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(clientData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/api/Clients/${id}`, {
      method: "DELETE",
    });
  },
};

// File upload API
export const fileAPI = {
  upload: async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetchAPI(`/api/Files/upload?type=${type}`, {
      method: "POST",
      headers: {}, // Let the browser set the content type for form data
      body: formData,
    });
  },
};

// Users APIs
export const usersAPI = {
  getAll: async () => {
    return fetchAPI("/api/Users");
  },

  getById: async (id) => {
    return fetchAPI(`/api/Users/${id}`);
  },

  create: async (userData) => {
    return fetchAPI("/api/Users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  update: async (id, userData) => {
    return fetchAPI(`/api/Users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/api/Users/${id}`, {
      method: "DELETE",
    });
  },
};

const api = {
  auth: authAPI,
  news: newsAPI,
  clients: clientsAPI,
  file: fileAPI,
  users: usersAPI,
};

export default api;
