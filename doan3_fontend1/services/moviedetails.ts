const BASE_URL = "http://localhost:3000";
export type MovieDetails = {
  movie_detail_id: number;
  movie_id: number;
  description: string;
  trailer_url: string;
  country: string;
  director: string;
  actors: string;
};
export type MovieDetailForm = {
  Movie_id: string;
  Description: string;
  Trailer_url: string;
  Country: string;
  Director: string;
  Actors: string;
};
export type MovieDetailchitiet = {
  movie_id: number;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  country: string;
  director: string;
  actors: string;
  poster: string;
  trailer_url: string;
  genres: string;
  genre_ids: string;
  status: string;
  created_at: string;
};
export const getallDetails = async () => {
  const res = await fetch(`${BASE_URL}/MovieDetails/all`);
  return res.json();
};
export const getidDetails = async (movie_id: number) => {
  const res = await fetch(`${BASE_URL}/MovieDetails/id/${movie_id}`);
  return res.json();
};
export const Insertdetails = async (from: MovieDetailForm) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/MovieDetails/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(from),
  });
  return res.json();
};
export const Updatedetails = async (from: MovieDetailForm, id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/MovieDetails/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(from),
  });
  return res.json();
};
export const Deletedetails = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/MovieDetails/delete/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};

export const getidmovie = async (id: string | number) => {
  try {
    const res = await fetch(`${BASE_URL}/MovieDetails/iddetail/${id}`);
    if (!res.ok) {
      throw new Error("Lỗi lấy chi tiết phim");
    }
    const data: MovieDetailchitiet[] = await res.json();
    return data[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
