"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type Booking = {
  booking_id: number;
  booking_code: string;
  total_amount: number | null;
  booking_status: string;
  created_at: string;
  title: string;
  poster: string;
  theater_name: string;
  room_name: string;
  start_time: string;
  seats: string;
};

type TokenType = {
  user_id: number;
};

export default function Vecuatoi() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [lastBookingId, setLastBookingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const lastId = localStorage.getItem("lastBookingId");

    setToken(storedToken);
    setLastBookingId(lastId ? Number(lastId) : null);

    if (!storedToken) {
      setLoading(false);
      setBookings([]);
      return;
    }

    // 🔥 decode user_id để dùng params
    let userId: number | null = null;
    try {
      const decoded = jwtDecode<TokenType>(storedToken);
      userId = decoded.user_id;
    } catch (err) {
      console.error("Token lỗi:", err);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/Booking/user/${userId}`, {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        // ✅ Kiểm tra status trước khi parse JSON
        if (!res.ok) {
          const text = await res.text();
          console.error(`Lỗi ${res.status}:`, text);
          setBookings([]);
          return;
        }
        const data = await res.json();
        console.log("API RESPONSE:", data);
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setBookings([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!token) {
    return (
      <div className="text-center mt-10 text-red-500">Bạn chưa đăng nhập</div>
    );
  }

  // loading
  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-10 pb-10 text-black px-4">
      <h1 className="text-2xl font-bold mb-5 bg-red-500 w-fit px-3 rounded-lg text-white py-1">
        Vé của tôi
      </h1>

      {bookings.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          Bạn chưa có vé nào
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-4 gap-6">
          {bookings.map((b) => {
            const isLast = b.booking_id === lastBookingId;

            return (
              <div
                key={b.booking_id}
                className={`border p-4 rounded-lg shadow-sm ${
                  isLast ? "border-green-500 bg-green-50" : ""
                }`}
              >
                <h2 className="text-center font-bold mb-2">CHI TIẾT VÉ</h2>

                <div className="flex justify-center">
                  <img
                    src={`http://localhost:3000${b.poster}`}
                    className="w-[150px] h-[220px] object-cover"
                    alt={b.title}
                  />
                </div>

                <h3 className="text-center font-bold mt-2">{b.title}</h3>

                <p>Rạp: {b.theater_name}</p>
                <p>Phòng: {b.room_name}</p>
                <p>Giờ chiếu: {b.start_time}</p>
                <p>Ghế: {b.seats}</p>

                <p>
                  Tổng tiền:{" "}
                  {b.total_amount
                    ? b.total_amount.toLocaleString() + " VND"
                    : "Chưa cập nhật"}
                </p>

                <p>Trạng thái: {b.booking_status}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
