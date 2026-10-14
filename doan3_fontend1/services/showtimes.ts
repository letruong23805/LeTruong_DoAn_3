import { Exo } from "next/font/google";

export type Movie = {
  movie_id: number;
  title: string;
};
const BASE_URL = "http://localhost:3000";
export type Showtimes = {
  showtime_id: number;
  movie_id: number;
  room_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  format: "2D" | "3D" | "IMAX";
  price: number;
  created_at: string;
};

export type Room = {
  room_id: number;
  theater_id: number;
  room_name: string;
  created_at: string;
};

export const getAllShowtimes = async () => {
  const res = await fetch(`${BASE_URL}/showtimes/all`);
  if (!res.ok) {
    throw new Error("Lỗi API" + res.status);
  }
  return res.json();
};
export const getAllRooms = async () => {
  const res = await fetch(`${BASE_URL}/rooms/all`);
  if (!res.ok) throw new Error("Lỗi API: " + res.status);
  return res.json();
};
export const searchShowtimes = async (keyword: string) => {
  const res = await fetch(`${BASE_URL}/showtimes/id/${keyword}`);
  return res.json();
};

export const getAllMovies = async () => {
  const res = await fetch(`${BASE_URL}/movies/all`);

  if (!res.ok) {
    throw new Error("Lỗi API: " + res.status);
  }

  return res.json();
};

export const insertShowtimes = async (
  movie_id: string,
  room_id: string,
  show_date: string,
  start_time: string,
  end_time: string,
  format: string,
  price: string,
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/showtimes/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Movie_id: movie_id,
      Room_id: room_id,
      Show_date: show_date,
      Start_time: start_time,
      End_time: end_time,
      Format: format,
      Price: price,
    }),
  });
  return res.json();
};
export const updateShowtimes = async (showtime: Showtimes) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `${BASE_URL}/showtimes/update/${showtime.showtime_id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Movie_id: showtime.movie_id,
        Room_id: showtime.room_id,
        Show_date: showtime.show_date?.split("T")[0],
        Start_time: showtime.start_time,
        End_time: showtime.end_time,
        Format: showtime.format,
        Price: showtime.price,
      }),
    },
  );
  return res.json();
};

// DELETE
export const deleteShowtimes = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/showtimes/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
