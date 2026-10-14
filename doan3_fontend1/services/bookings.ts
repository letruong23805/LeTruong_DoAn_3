export type Bookings = {
  booking_id: number;
  user_id: number;
  booking_code: string;
  showtime_id: number;
  total_amount: number;
  booking_status: "pending" | "paid" | "cancelled";
  created_at: string;
};

export type BookingDetail = {
  booking_detail_id: number;
  booking_id: number;
  seat_id: number;
  showtime_id: number;
};

export type Seat = {
  seat_id: number;
  seat_number: string;
};

export type Showtime = {
  showtime_id: number;
  start_time: string;
  movie_id: number;
};

export type Movie = {
  movie_id: number;
  title: string;
};

export type InsertBookingPayload = {
  User_id: string;
  booking_code: string;
  showtime_id: string;
  total_amount: string;
  booking_status: string;
};

export type UpdateBookingPayload = {
  User_id: number;
  booking_code: string;
  showtime_id: number;
  total_amount: number;
  booking_status: string;
};

export type InsertBookingDetailPayload = {
  Booking_id: number | null;
  Seat_id: number | null;
  Showtime_id: number | null;
};

export type UpdateBookingDetailPayload = {
  Booking_id: number;
  Seat_id: number;
  Showtime_id: number;
};

const BASE_URL = "http://localhost:3000";

const getToken = () => localStorage.getItem("token");

// ── Bookings ──────────────────────────────────────

export const getAllBookings = async () => {
  const res = await fetch(`${BASE_URL}/Booking/all`);
  return res.json();
};

export const searchBookingById = async (keyword: string) => {
  const res = await fetch(`${BASE_URL}/Booking/id/${keyword}`);
  return res.json();
};

export const insertBooking = async (payload: InsertBookingPayload) => {
  const res = await fetch(`${BASE_URL}/Booking/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateBooking = async (
  id: number,
  payload: UpdateBookingPayload,
) => {
  const res = await fetch(`${BASE_URL}/Booking/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteBooking = async (id: number) => {
  const res = await fetch(`${BASE_URL}/Booking/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

// ── Booking Details ───────────────────────────────

export const getBookingDetailsByBookingId = async (bookingId: number) => {
  const res = await fetch(`${BASE_URL}/bookingsdetails/booking/${bookingId}`);
  return res.json();
};

export const insertBookingDetail = async (
  payload: InsertBookingDetailPayload,
) => {
  const res = await fetch(`${BASE_URL}/bookingsdetails/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const updateBookingDetail = async (
  id: number,
  payload: UpdateBookingDetailPayload,
) => {
  const res = await fetch(`${BASE_URL}/bookingsdetails/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};

export const deleteBookingDetail = async (id: number) => {
  const res = await fetch(`${BASE_URL}/bookingsdetails/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return res.json();
};

// ── Supporting Data ───────────────────────────────

export const getAllSeats = async () => {
  const res = await fetch(`${BASE_URL}/seats/all`);
  return res.json();
};

export const getAllShowtimes = async () => {
  const res = await fetch(`${BASE_URL}/showtimes/all`);
  return res.json();
};

export const getAllMovies = async () => {
  const res = await fetch(`${BASE_URL}/movies/all`);
  return res.json();
};
