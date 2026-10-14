const API = "http://localhost:3000/genres";
export type Genres = {
  genre_id: number;
  genre_name: string;
};

export const getAllGenres = async () => {
  const res = await fetch(`${API}/all`);
  if (!res.ok) {
    throw new Error("API lỗi: " + res.status);
  }
  return res.json();
};

export const searchGenres = async (keyword: string) => {
  const res = await fetch(`${API}/name?name=${keyword}`);
  return res.json();
};

export const insertGenre = async (name: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const updateGenre = async (id: number, name: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message);
  }

  return data;
};

export const deleteGenre = async (id: number) => {
  const token = localStorage.getItem("token");

  await fetch(`${API}/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
