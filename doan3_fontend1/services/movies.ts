const BASE_URL = "http://localhost:3000";

export type Movies = {
  movie_id: number;
  title: string;
  duration: number;
  release_date: string;
  poster: string;
  genre_id: number;
  status: string;
  created_at: string;
  genres: string;
  genre_ids: string;
};

export type MovieForm = {
  Title: string;
  Duration: string;
  Release_date: string;
  Genre_ids: string[];
  Status: "coming" | "showing" | "ended";
};

export type Genres = {
  genre_id: number;
  genre_name: string;
};

export const getAllMovies = async () => {
  const res = await fetch(`${BASE_URL}/movies/all`);
  return res.json();
};

export const getAllGenres = async () => {
  const res = await fetch(`${BASE_URL}/genres/all`);
  return res.json();
};

export const searchMoviesByName = async (keyword: string) => {
  const res = await fetch(`${BASE_URL}/movies/name?name=${keyword}`);
  return res.json();
};

export const timkiemtrangchu = async (keyword: string) => {
  const res = await fetch(
    `${BASE_URL}/movies/name?name=${encodeURIComponent(keyword)}`,
  );

  return res.json();
};

export const insertMovie = async (form: MovieForm, posterFile: File | null) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("Title", form.Title);
  formData.append("Duration", form.Duration);
  formData.append("Release_date", form.Release_date);
  formData.append("Status", form.Status);

  form.Genre_ids.forEach((id) => {
    formData.append("Genre_ids[]", id);
  });

  if (posterFile) {
    formData.append("Poster", posterFile);
  }

  const res = await fetch(`${BASE_URL}/movies/insert`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Thêm phim thất bại");
  }
};

export const updateMovie = async (
  movieId: number,
  form: MovieForm,
  posterFile: File | null,
) => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  formData.append("Title", form.Title);
  formData.append("Duration", form.Duration);
  formData.append("Release_date", form.Release_date);
  formData.append("Status", form.Status);

  form.Genre_ids.forEach((id) => {
    formData.append("Genre_ids[]", id);
  });

  if (posterFile) {
    formData.append("Poster", posterFile);
  }

  const res = await fetch(`${BASE_URL}/movies/update/${movieId}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Cập nhật phim thất bại");
  }
};

export const deleteMovie = async (id: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/movies/delete/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Xóa phim thất bại");
  }

  return data.message;
};
