const BASE_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

// ── Types ──────────────────────────────────────────

export type Users = {
  user_id: number;
  role_id: number;
  username: string;
  email: string;
  password: string;
  status: "active" | "inactive";
  created_at: string;
};

export type InsertUserPayload = {
  Username: string;
  Email: string;
  Password: string;
};

export type UpdateUserPayload = {
  Role_id: number;
  Username: string;
  Email: string;
  Password: string;
  Status: string;
};

// ── API Functions ──────────────────────────────────

export const getAllUsers = async (): Promise<Users[]> => {
  const res = await fetch(`${BASE_URL}/User/all`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const searchUsersByName = async (name: string): Promise<Users[]> => {
  const res = await fetch(`${BASE_URL}/User/name?name=${name}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const insertUser = async (payload: InsertUserPayload) => {
  const res = await fetch(`${BASE_URL}/User/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateUser = async (id: number, payload: UpdateUserPayload) => {
  const res = await fetch(`${BASE_URL}/User/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteUser = async (id: number) => {
  const res = await fetch(`${BASE_URL}/User/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};
