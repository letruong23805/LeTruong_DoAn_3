"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// ===== TYPE =====
type Movie = {
  movie_id: number;
  title: string;
  poster: string;
};

type Theater = {
  theater_id: number;
  name: string;
};

type Room = {
  room_id: number;
};

type Showtime = {
  showtime_id: number;
  start_time: string;
};

type Seat = {
  seat_id: number;
  seat_number: string;
};

type BookingData = {
  movie: Movie;
  theater: Theater;
  room: Room;
  showtime: Showtime;
  seats: Seat[];
};

type DecodedToken = {
  user_id: number;
};
export default function Chitietdatve() {
  const [data, setData] = useState<BookingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const router = useRouter();
  function parseBookingData(json: string): unknown {
    return JSON.parse(json);
  }
  useEffect(() => {
    const luudulieu = localStorage.getItem("bookingData");
    if (!luudulieu) return;

    try {
      const parsed = parseBookingData(luudulieu);

      if (
        typeof parsed === "object" &&
        parsed !== null &&
        "movie" in parsed &&
        "seats" in parsed
      ) {
        setData(parsed as BookingData);
      } else {
        throw new Error("Sai format");
      }
    } catch (err) {
      console.error("Dữ liệu localStorage không hợp lệ", err);
    }
  }, []);
  useEffect(() => {
    if (!data) return;

    const tinhTien = async () => {
      try {
        const resShowtime = await fetch(
          `http://localhost:3000/showtimes/id/${data.showtime.showtime_id}`,
        );
        const showtimeData = await resShowtime.json();

        console.log("showtimeData:", showtimeData);

        // ✅ Ép kiểu number
        const basePrice = Number(showtimeData[0]?.price) || 0;

        let tong = 0;

        for (const seat of data.seats) {
          const resSeat = await fetch(
            `http://localhost:3000/seats/id/${seat.seat_id}`,
          );
          const seatData = await resSeat.json();

          console.log("seatData:", seatData);

          const seatType = seatData[0]?.seat_type;

          if (seatType === "vip") {
            tong += basePrice * 1.2;
          } else {
            tong += basePrice;
          }
        }

        console.log("Tổng tiền:", tong);

        setTotal(tong);
      } catch (err) {
        console.error("Lỗi tính tiền", err);
      }
    };

    tinhTien();
  }, [data]);
  if (!data) return <div>Không có dữ liệu</div>;
  const datve = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }
      if (!paymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán");
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      const user_id = decoded.user_id;

      // ✅ Gửi total_amount: 0 — trigger MySQL sẽ tự cộng tiền
      const res = await fetch("http://localhost:3000/Booking/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          User_id: user_id,
          booking_code: "BK" + Date.now(),
          showtime_id: data.showtime.showtime_id,
          total_amount: 0,
          // booking_status: paymentMethod === "online" ? "paid" : "pending",
          booking_status: "pending",
        }),
      });

      // ✅ Kiểm tra HTTP status trước
      if (!res.ok) {
        const errText = await res.text();
        alert(`Lỗi ${res.status}: ${errText}`);
        return;
      }

      const bokingdata = await res.json();
      console.log("Response booking:", bokingdata);

      // ✅ insertId nằm trong bokingdata.booking (là MySQL result object)
      const booking_id = bokingdata?.booking?.insertId;
      if (!booking_id) {
        alert("Tạo booking thất bại: " + JSON.stringify(bokingdata));
        return;
      }

      // Insert BookingDetails
      await Promise.all(
        data.seats.map((seat) =>
          fetch("http://localhost:3000/bookingsdetails/insert", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              Booking_id: booking_id,
              Seat_id: seat.seat_id,
              Showtime_id: data.showtime.showtime_id,
            }),
          }),
        ),
      );

      // ✅ Chờ trigger cập nhật total_amount
      let totalAmount = 0;
      let retry = 0;
      while (totalAmount === 0 && retry < 10) {
        await new Promise((r) => setTimeout(r, 300));
        const resTotal = await fetch(
          `http://localhost:3000/Booking/id/${booking_id}`,
        );
        const bookingFinal = await resTotal.json();
        // ✅ API trả về array nên lấy [0]
        totalAmount = Number(bookingFinal[0]?.total_amount) || 0;
        retry++;
      }

      setTotal(totalAmount);
      alert("Đặt vé thành công!");
      localStorage.removeItem("bookingData");
      localStorage.setItem("lastBookingId", booking_id.toString());
      router.push("/home/trangchu");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Đặt vé thất bại: " + (error as Error).message);
    }
  };
  return (
    <div className="pt-10 text-black pb-10">
      <div className="w-[350px] h-auto border m-auto rounded-lg">
        <h2 className="uppercase w-full flex justify-center pt-3 font-bold">
          Chi tiết thông tin đặt vé
        </h2>
        <div className="flex justify-center">
          <img
            src={`http://localhost:3000${data.movie.poster}`}
            alt={data.movie.title}
            className="pt-5 pb-5 w-[180px] h-[300px]"
          />
        </div>
        <div className="pl-5">
          <h3 className="capitalize w-full flex justify-center font-bold ">
            {data.movie.title}
          </h3>
          <h3 className="capitalize">Rạp:{data.theater.name}</h3>
          <h3 className="capitalize">Phòng chiếu phim: {data.room.room_id}</h3>
          <h3 className="capitalize">Lịch chiếu: {data.showtime.start_time}</h3>
          <h3 className="capitalize">
            Ghế ngồi: {data.seats.map((s) => s.seat_number).join(", ")}
          </h3>
          <h3 className="capitalize">
            Tổng tiền:{" "}
            {total > 0 ? total.toLocaleString() + " VND" : "Đang tính..."}
          </h3>
        </div>
        <div className="p-5">
          <h3 className="font-semibold mb-2">Chọn phương thức thanh toán:</h3>

          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                onChange={(e) => setPaymentMethod(e.target.value)}
                value="online"
                className="w-4 h-4 accent-blue-500"
              />
              Thanh toán qua ngân hàng
            </label>
            {paymentMethod === "online" && (
              <div className=" mt-3 p-3 border rounded-lg bg-blue-50">
                <h3 className="text-center text-red-600 font-bold mb-3">
                  Vui lòng chụp lại bill chuyển khoản sau khi thanh toán
                </h3>

                <div className="flex justify-center">
                  <img
                    src="/img/maqr.jpg"
                    alt="QR Thanh toán"
                    className="w-[250px] rounded-lg border"
                  />
                </div>

                <div className="mt-3 text-center">
                  <p className="font-semibold">Nội dung chuyển khoản:</p>
                  <p className="text-blue-600 font-bold">
                    VEPHIM-{data.showtime.showtime_id}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    {total.toLocaleString()} VNĐ
                  </p>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                onChange={(e) => setPaymentMethod(e.target.value)}
                value="counter"
                className="w-4 h-4 accent-blue-500"
              />
              Thanh toán tại quầy
            </label>
          </div>
        </div>
        <div className="w-full flex justify-center pb-5">
          <button
            onClick={datve}
            className={`w-[170px] h-[35px] rounded-lg text-white capitalize transition-colors ${
              !paymentMethod
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            Xác nhận Đặt vé
          </button>
        </div>
      </div>
      {/* Hiển thị QR khi chọn thanh toán online
      {paymentMethod === "online" && (
        <div className="mt-4 p-4 border rounded-lg bg-blue-50 w-[300px] m-auto">
          <h3 className="text-center text-red-600 font-bold mb-3">
            Vui lòng chụp lại bill chuyển khoản sau khi thanh toán
          </h3>

          <div className="flex justify-center">
            <img
              src="/img/maqr.jpg"
              alt="QR Thanh toán"
              className="w-[300px] rounded-lg border"
            />
          </div>

          <div className="mt-3 text-center">
            <p className="font-semibold">Nội dung chuyển khoản:</p>
            <p className="text-blue-600 font-bold">
              VEPHIM-{data.showtime.showtime_id}
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
}
