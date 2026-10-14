"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Bookings,
  BookingDetail,
  Seat,
  Showtime,
  Movie,
  getAllBookings,
  searchBookingById,
  insertBooking,
  updateBooking,
  deleteBooking,
  getBookingDetailsByBookingId,
  insertBookingDetail,
  updateBookingDetail,
  deleteBookingDetail,
  getAllSeats,
  getAllShowtimes,
  getAllMovies,
} from "@/services/bookings";

export default function QLDatVe() {
  // ============ STATE: Modal flags ============
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);
  const [chitiet, setchitiet] = useState(false);
  const [themchitiet, setthemchitiet] = useState(false);
  const [suachitiet, setsuachitiet] = useState(false);

  // ============ STATE: Bookings ============
  const [bookings, setbookings] = useState<Bookings[]>([]);
  const [keyword, setkeyword] = useState("");
  const [user_id, setUserId] = useState("");
  const [booking_code, setBookingCode] = useState("");
  const [showtime_id, setShowtimeId] = useState("");
  const [total_amount, setTotalAmount] = useState("");
  const [booking_status, setBookingStatus] = useState("pending");
  const [updateBookingState, setUpdateBookingState] = useState<Bookings | null>(
    null,
  );

  // ============ STATE: Supporting data ============
  const [seats, setSeats] = useState<Seat[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);

  // ============ STATE: Booking Details ============
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(
    null,
  );
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState<number | null>(
    null,
  );
  const [updateBookingDetailState, setUpdateBookingDetailState] =
    useState<BookingDetail | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // ============ EFFECTS ============
  useEffect(() => {
    getAllBookings().then((data) =>
      setbookings(Array.isArray(data) ? data : []),
    );
    getAllSeats().then((data) => setSeats(Array.isArray(data) ? data : []));
    getAllShowtimes().then((data) =>
      setShowtimes(Array.isArray(data) ? data : []),
    );
    getAllMovies().then((data) => setMovies(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    if (!selectedBookingId) return;
    const fetchDetails = async () => {
      try {
        setLoadingDetails(true);
        const data = await getBookingDetailsByBookingId(selectedBookingId);
        setBookingDetails(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedBookingId]);

  // ============ HELPERS ============
  const getSeatName = (id: number | string) =>
    seats.find((s) => s.seat_id === Number(id))?.seat_number || "Không rõ";

  const getShowtimeName = (id: number | string) =>
    showtimes.find((s) => s.showtime_id === Number(id))?.start_time ||
    "Không rõ";

  const getMovieNameByShowtime = (showtime_id: number | string) => {
    const st = showtimes.find((s) => s.showtime_id === Number(showtime_id));
    if (!st) return "Không rõ";
    return movies.find((m) => m.movie_id === st.movie_id)?.title || "Không rõ";
  };

  // ============ HANDLERS: Bookings ============
  const reload = async () => {
    try {
      const data: Bookings[] = await getAllBookings();
      setbookings(data);
    } catch (err) {
      console.log(err);
    }
  };

  const searchbooking = async () => {
    const data: Bookings[] = await searchBookingById(keyword);
    setbookings(data);
  };

  const Insertbooking = async () => {
    try {
      const data = await insertBooking({
        User_id: user_id,
        booking_code,
        showtime_id,
        total_amount,
        booking_status,
      });
      alert(data.message);
      const newdata: Bookings[] = await getAllBookings();
      setbookings(newdata);
      setUserId("");
      setBookingCode("");
      setShowtimeId("");
      setTotalAmount("");
      setBookingStatus("pending");
      setshowmodual(false);
    } catch (err) {
      console.log(err);
      alert("Thêm thất bại");
    }
  };

  const Updatebooking = async () => {
    if (!updateBookingState) return;
    try {
      const data = await updateBooking(updateBookingState.booking_id, {
        User_id: updateBookingState.user_id,
        booking_code: updateBookingState.booking_code,
        showtime_id: updateBookingState.showtime_id,
        total_amount: updateBookingState.total_amount,
        booking_status: updateBookingState.booking_status,
      });
      alert(data.message);
      const newdata: Bookings[] = await getAllBookings();
      setbookings(newdata);
      setupdate(false);
      setUpdateBookingState(null);
    } catch (error) {
      console.error(error);
      alert("Sửa thất bại");
    }
  };

  const deletebooking = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa không")) return;
    try {
      const data = await deleteBooking(id);
      alert(data.message);
      const newdata: Bookings[] = await getAllBookings();
      setbookings(newdata);
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  // ============ HANDLERS: Booking Details ============
  const Insertbookdetails = async () => {
    try {
      const data = await insertBookingDetail({
        Booking_id: selectedBookingId,
        Seat_id: selectedSeatId,
        Showtime_id: selectedShowtimeId,
      });
      alert(data.message);
      if (selectedBookingId) {
        const newdata: BookingDetail[] =
          await getBookingDetailsByBookingId(selectedBookingId);
        setBookingDetails(newdata);
      }
      setSelectedSeatId(null);
      setSelectedShowtimeId(null);
      setthemchitiet(false);
    } catch (error) {
      console.error(error);
      alert("Thêm chi tiết thất bại");
    }
  };

  const Updatebookdetail = async () => {
    if (!updateBookingDetailState) {
      alert("Không có chi tiết nào để sửa");
      return;
    }
    if (
      !updateBookingDetailState.booking_id ||
      !updateBookingDetailState.seat_id ||
      !updateBookingDetailState.showtime_id
    ) {
      alert("Vui lòng chọn đầy đủ Mã đặt vé, Mã ghế và Mã suất chiếu");
      return;
    }
    try {
      const data = await updateBookingDetail(
        updateBookingDetailState.booking_detail_id,
        {
          Booking_id: updateBookingDetailState.booking_id,
          Seat_id: updateBookingDetailState.seat_id,
          Showtime_id: updateBookingDetailState.showtime_id,
        },
      );
      alert(data.message);
      const newdata: BookingDetail[] = await getBookingDetailsByBookingId(
        updateBookingDetailState.booking_id,
      );
      setBookingDetails(newdata);
      setsuachitiet(false);
      setUpdateBookingDetailState(null);
    } catch (error) {
      console.error(error);
      alert("Sửa chi tiết thất bại");
    }
  };

  const deletebookidetail = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa chi tiết đặt vé này?")) return;
    try {
      const data = await deleteBookingDetail(id);
      alert(data.message);
      if (selectedBookingId) {
        const newdata: BookingDetail[] =
          await getBookingDetailsByBookingId(selectedBookingId);
        setBookingDetails(newdata);
      }
    } catch (error) {
      console.error(error);
      alert("Xóa chi tiết thất bại");
    }
  };

  // ============ RENDER ============
  return (
    <div className="ml-10 p-10">
      <div className="h-10 w-60 bg-amber-400 mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý đặt vé
      </div>
      <div className="flex mb-10">
        <div className="flex">
          <input
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            type="text"
            placeholder="Tìm kiếm đặt vé"
            className="w-[400px] pl-5 h-8 mr-15 rounded outline-none border-b border-gray-400 focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
          />
          <button
            onClick={searchbooking}
            className="bg-blue-600 hover:bg-blue-700 w-25 h-8 rounded cursor-pointer"
          >
            Tìm kiếm
          </button>
          <RefreshCw
            onClick={reload}
            className="ml-12 bg-blue-600 w-20 h-8 rounded-lg cursor-pointer"
          />
        </div>
        <div className="flex ml-60">
          <button
            onClick={() => setshowmodual(true)}
            className="capitalize h-8 w-50 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
          >
            + Thêm vé xem phim
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse">
            <thead className="bg-gray-100 uppercase text-sm text-black">
              <tr>
                <th className="p-3">Mã đặt vé</th>
                <th className="p-3">Mã người dùng</th>
                <th className="p-3">Mã booking</th>
                <th className="p-3">Mã suất chiếu</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Thời gian tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {bookings.map((b) => (
                <tr key={b.booking_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{b.booking_id}</td>
                  <td className="p-3">{b.user_id}</td>
                  <td className="p-3">{b.booking_code}</td>
                  <td className="p-3">{b.showtime_id}</td>
                  <td className="p-3">{b.total_amount}</td>
                  <td className="p-3">{b.booking_status}</td>
                  <td className="p-3">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center space-x-2 flex">
                    <button
                      onClick={() => {
                        setupdate(true);
                        setUpdateBookingState(b);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deletebooking(b.booking_id)}
                      className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => {
                        setchitiet(true);
                        setSelectedBookingId(b.booking_id);
                      }}
                      className="px-3 py-1 bg-green-500 rounded hover:bg-green-600 text-white"
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Thêm booking */}
        {showmodual && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] text-black">
              <h2 className="text-xl flex justify-center font-semibold mb-4">
                Thêm vé xem phim
              </h2>
              <h3 className="capitalize">Mã người dùng:</h3>
              <input
                value={user_id}
                onChange={(e) => setUserId(e.target.value)}
                type="text"
                placeholder="Nhập mã người dùng"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3 className="capitalize">Mã đặt vé:</h3>
              <input
                value={booking_code}
                onChange={(e) => setBookingCode(e.target.value)}
                type="text"
                placeholder="Nhập mã đặt vé"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3 className="capitalize">Mã suất chiếu:</h3>
              <input
                value={showtime_id}
                onChange={(e) => setShowtimeId(e.target.value)}
                type="text"
                placeholder="Nhập mã suất chiếu"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Tổng tiền</h3>
              <input
                value={total_amount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="Nhập tổng tiền"
                type="text"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Trạng thái đặt vé</h3>
              <select
                value={booking_status}
                onChange={(e) => setBookingStatus(e.target.value)}
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">Chọn trạng thái</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="cancelled">cancelled</option>
              </select>
              <div className="flex justify-center">
                <button
                  onClick={() => setshowmodual(false)}
                  className="w-30 bg-blue-300 m-4 h-8 capitalize hover:bg-blue-500 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={Insertbooking}
                  className="w-30 bg-blue-500 m-4 h-8 capitalize hover:bg-blue-700 rounded-lg"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sửa booking */}
        {showupdate && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="w-[400px] bg-white text-black rounded-lg p-6">
              <h2 className="flex justify-center font-bold uppercase">
                Sửa thông tin đặt vé
              </h2>
              <h3 className="capitalize">Mã người dùng:</h3>
              <input
                value={updateBookingState?.user_id}
                onChange={(e) =>
                  setUpdateBookingState({
                    ...updateBookingState!,
                    user_id: Number(e.target.value),
                  })
                }
                type="text"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3 className="capitalize">Mã đặt vé:</h3>
              <input
                value={updateBookingState?.booking_code}
                onChange={(e) =>
                  setUpdateBookingState({
                    ...updateBookingState!,
                    booking_code: e.target.value,
                  })
                }
                type="text"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3 className="capitalize">Mã suất chiếu:</h3>
              <input
                value={updateBookingState?.showtime_id}
                onChange={(e) =>
                  setUpdateBookingState({
                    ...updateBookingState!,
                    showtime_id: Number(e.target.value),
                  })
                }
                type="text"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Tổng tiền</h3>
              <input
                value={updateBookingState?.total_amount}
                onChange={(e) =>
                  setUpdateBookingState({
                    ...updateBookingState!,
                    total_amount: Number(e.target.value),
                  })
                }
                type="text"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Trạng thái đặt vé</h3>
              <select
                value={updateBookingState?.booking_status}
                onChange={(e) =>
                  setUpdateBookingState({
                    ...updateBookingState!,
                    booking_status: e.target.value as
                      | "pending"
                      | "paid"
                      | "cancelled",
                  })
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">Chọn trạng thái</option>
                <option value="pending">pending</option>
                <option value="paid">paid</option>
                <option value="cancelled">cancelled</option>
              </select>
              <div className="flex justify-center">
                <button
                  onClick={() => setupdate(false)}
                  className="bg-blue-400 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                >
                  Hủy
                </button>
                <button
                  onClick={Updatebooking}
                  className="bg-blue-500 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                >
                  Sửa
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Chi tiết */}
        {chitiet && (
          <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-[800px] max-h-[500px] overflow-y-auto p-4">
              <h2 className="text-xl font-bold text-center mb-4 text-black">
                Chi tiết đặt vé
              </h2>
              <table className="w-full text-left border border-collapse">
                <thead className="bg-gray-100 uppercase text-sm text-black">
                  <tr>
                    <th className="p-3">Mã chi tiết</th>
                    <th className="p-3">Mã đặt vé</th>
                    <th className="p-3">Ghế</th>
                    <th className="p-3">Suất chiếu</th>
                    <th className="p-3">Phim</th>
                    <th className="p-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {loadingDetails ? (
                    <tr>
                      <td colSpan={6} className="text-center p-3">
                        Đang tải dữ liệu...
                      </td>
                    </tr>
                  ) : (
                    bookingDetails.map((d) => (
                      <tr
                        key={d.booking_detail_id}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="p-3">{d.booking_detail_id}</td>
                        <td className="p-3">{d.booking_id}</td>
                        <td className="p-3">{getSeatName(d.seat_id)}</td>
                        <td className="p-3">
                          {getShowtimeName(d.showtime_id)}
                        </td>
                        <td className="p-3">
                          {getMovieNameByShowtime(d.showtime_id)}
                        </td>
                        <td className="p-3 text-center space-x-2 flex">
                          <button
                            onClick={() => {
                              setsuachitiet(true);
                              setUpdateBookingDetailState(d);
                            }}
                            className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() =>
                              deletebookidetail(d.booking_detail_id)
                            }
                            className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setthemchitiet(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Thêm
                </button>

                <button
                  onClick={() => {
                    setchitiet(false);
                    setBookingDetails([]);
                    setSelectedBookingId(null);
                  }}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Thêm chi tiết */}
        {themchitiet && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="w-[400px] bg-white text-black rounded-lg p-6">
              <h2 className="flex justify-center text-2xl uppercase">
                Thêm chi tiết đặt vé
              </h2>
              <h3 className="capitalize">Mã đặt vé:</h3>
              <select
                value={selectedBookingId || ""}
                onChange={(e) => setSelectedBookingId(Number(e.target.value))}
                className="w-full border my-1 p-1 pl-2 rounded-lg"
              >
                <option value="">-- Chọn đặt vé --</option>
                {bookings.map((b) => (
                  <option key={b.booking_id} value={b.booking_id}>
                    {b.booking_code} - User {b.user_id}
                  </option>
                ))}
              </select>
              <h3 className="capitalize">Mã ghế:</h3>
              <select
                value={selectedSeatId || ""}
                onChange={(e) => setSelectedSeatId(Number(e.target.value))}
                className="w-full border my-1 p-1 pl-2 rounded-lg"
              >
                <option value="">-- Chọn ghế --</option>
                {seats.map((s) => (
                  <option key={s.seat_id} value={s.seat_id}>
                    {s.seat_number}
                  </option>
                ))}
              </select>
              <h3 className="capitalize">Mã suất chiếu:</h3>
              <select
                value={selectedShowtimeId || ""}
                onChange={(e) => setSelectedShowtimeId(Number(e.target.value))}
                className="w-full border my-1 p-1 pl-2 rounded-lg"
              >
                <option value="">-- Chọn suất chiếu --</option>
                {showtimes.map((st) => (
                  <option key={st.showtime_id} value={st.showtime_id}>
                    {st.start_time} - {getMovieNameByShowtime(st.showtime_id)}
                  </option>
                ))}
              </select>
              <div className="flex justify-between mt-8">
                <button
                  onClick={Insertbookdetails}
                  className="w-20 bg-blue-500 rounded-lg p-1 text-white cursor-pointer"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setthemchitiet(false)}
                  className="w-20 bg-emerald-500 rounded-lg p-1 text-white cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sửa chi tiết */}
        {suachitiet && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="w-[400px] bg-white text-black rounded-lg p-6">
              <h2 className="flex justify-center text-2xl uppercase">
                Sửa chi tiết đặt vé
              </h2>
              <h3 className="capitalize">Mã đặt vé:</h3>
              <select
                value={updateBookingDetailState?.booking_id || ""}
                onChange={(e) =>
                  setUpdateBookingDetailState({
                    ...updateBookingDetailState!,
                    booking_id: Number(e.target.value),
                  })
                }
                className="w-full border my-1 p-1 pl-2 rounded-lg"
              >
                {bookings.map((b) => (
                  <option key={b.booking_id} value={b.booking_id}>
                    {b.booking_code} - User {b.user_id}
                  </option>
                ))}
              </select>
              <h3 className="capitalize">Mã ghế:</h3>
              <select
                value={updateBookingDetailState?.seat_id || ""}
                onChange={(e) =>
                  setUpdateBookingDetailState({
                    ...updateBookingDetailState!,
                    seat_id: Number(e.target.value),
                  })
                }
                className="w-full border my-1 p-1 pl-2 rounded-lg"
              >
                {seats.map((s) => (
                  <option key={s.seat_id} value={s.seat_id}>
                    {s.seat_number}
                  </option>
                ))}
              </select>
              <h3 className="capitalize">Mã suất chiếu:</h3>
              <select
                value={updateBookingDetailState?.showtime_id || ""}
                onChange={(e) =>
                  setUpdateBookingDetailState({
                    ...updateBookingDetailState!,
                    showtime_id: Number(e.target.value),
                  })
                }
                className="w-full border my-1 p-1 pl-2 rounded-lg"
              >
                {showtimes.map((st) => (
                  <option key={st.showtime_id} value={st.showtime_id}>
                    {st.start_time} - {getMovieNameByShowtime(st.showtime_id)}
                  </option>
                ))}
              </select>
              <div className="flex justify-between mt-8">
                <button
                  onClick={Updatebookdetail}
                  className="w-20 bg-blue-500 rounded-lg p-1 text-white cursor-pointer"
                >
                  Sửa
                </button>
                <button
                  onClick={() => setsuachitiet(false)}
                  className="w-20 bg-emerald-500 rounded-lg p-1 text-white cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
