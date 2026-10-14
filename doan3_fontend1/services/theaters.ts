const API = "http://localhost:3000/theater";
export type Theater = {
  theater_id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
};

export const getall = async () => {
  const res = await fetch(`${API}/All`);
  if (!res.ok) {
    throw new Error("Lỗi API:" + res.status);
  }
  return res.json();
};
export const search = async (keyword: string) => {
  const res = await fetch(`${API}/Name?Name=${keyword}`);
  return res.json();
};
export const inserttheaters = async (
  name: string,
  address: string,
  phone: string,
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/Insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Name: name, Address: address, Phone: phone }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};
export const updatetheaters = async (
  id: number,
  name: string,
  address: string,
  phone: string,
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Name: name, Address: address, Phone: phone }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const deletetheaters = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data;
};
