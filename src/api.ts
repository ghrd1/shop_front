import axios from "axios";

const API_URL = "";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post("/users/sign_in", { user: { email, password } }),
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) =>
    api.post("/users", {
      user: { email, password, first_name: firstName, last_name: lastName },
    }),
  logout: () => api.delete("/users/sign_out"),
};

// Items API
export const itemsAPI = {
  getAll: () => api.get("/items"),
  getById: (id: number) => api.get(`/items/${id}`),
  search: (query: string) => api.get(`/items?q=${query}`),
  create: (data: { name: string; description: string; price: number }) =>
    api.post("/items", { item: data }),
  update: (
    id: number,
    data: { name: string; description: string; price: number },
  ) => api.put(`/items/${id}`, { item: data }),
  delete: (id: number) => api.delete(`/items/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get("/orders"),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (orderItems: { item_id: number; quantity: number }[]) =>
    api.post("/orders", { order_items: orderItems }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data: { first_name: string; last_name: string }) =>
    api.patch("/users/profile", { user: data }),
  getAll: () => api.get("/users"),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (
    id: number,
    data: {
      first_name: string;
      last_name: string;
      email: string;
      role: string;
    },
  ) => api.patch(`/users/${id}`, { user: data }),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export default api;
