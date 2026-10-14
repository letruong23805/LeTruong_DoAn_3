const BASE_URL = "http://localhost:3000";

export type Room = {
  room_id: number;
  theater_id: number;
  room_name: string;
  total_seats: number;
  created_at: string;
};

export type Theater = {
  theater_id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
};

// GET
export const getAllTheaters = async () => {
  const res = await fetch(`${BASE_URL}/theater/All`);
  return res.json();
};

export const getAllRooms = async () => {
  const res = await fetch(`${BASE_URL}/rooms/all`);
  return res.json();
};

export const searchRoomByName = async (keyword: string) => {
  const res = await fetch(`${BASE_URL}/rooms/name?name=${keyword}`);
  return res.json();
};

// POST
export const insertRoom = async (
  theater_id: number,
  room_name: string,
  total_seats: number,
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/rooms/Insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Theater_id: theater_id,
      Room_name: room_name,
      Total_seats: total_seats,
    }),
  });
  return res.json();
};

// PUT
export const updateRoom = async (room: Room) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/rooms/update/${room.room_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Theater_id: room.theater_id,
      Room_name: room.room_name,
      Total_seats: room.total_seats,
    }),
  });
  return res.json();
};

// DELETE
export const deleteRoom = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/rooms/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.json();
};
