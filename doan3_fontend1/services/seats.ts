const BASE_URL = "http://localhost:3000";

export type Seat = {
  seat_id: number;
  room_id: number;
  seat_number: string;
  seat_type: "normal" | "vip";
  created_at: string;
};

export const getallseats = async () => {
  const res = await fetch(`${BASE_URL}/seats/all`);
  if (!res.ok) throw new Error("Lỗi API:" + res.status);
  return res.json();
};

export const searchseats = async (keyword: string) => {
  if (!keyword) {
    const res = await fetch(`${BASE_URL}/seats/all`);
    return res.json();
  }
  const res = await fetch(`${BASE_URL}/seats/number/${keyword}`);
  return res.json();
};

export const insertseats = async (
  room_id: number,
  seat_number: string,
  seat_type: "normal" | "vip",
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/seats/Insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Room_id: room_id,
      Seat_number: seat_number,
      Seat_type: seat_type,
    }),
  });
  return res.json();
};

export const updateseats = async (
  id: number,
  room_id: number,
  seat_number: string,
  seat_type: "normal" | "vip",
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/seats/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Room_id: room_id,
      Seat_number: seat_number,
      Seat_type: seat_type,
    }),
  });
  return res.json();
};

export const deleteseats = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/seats/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
export const createSeatsAuto = async (room_id: number, total_seats: number) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/seats/create-seats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      room_id,
      Total_seats: total_seats,
    }),
  });

  return res.json();
};
