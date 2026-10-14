"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Showtimes,
  Room,
  Movie,
  getAllShowtimes,
  getAllRooms,
  getAllMovies,
  searchShowtimes,
  insertShowtimes,
  updateShowtimes,
  deleteShowtimes,
} from "@/services/showtimes";

export default function QLShowtimes() {
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);
  const [showtimes, setshowtimes] = useState<Showtimes[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [keyword, setkeyword] = useState("");
  const [updateshow, setupdateshow] = useState<Showtimes | null>(null);

  const [movie_id, setMovieId] = useState("");
  const [room_id, setRoomId] = useState("");
  const [show_date, setShowDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [format, setFormat] = useState("2D");
  const [price, setPrice] = useState("");

  // LOAD
  useEffect(() => {
    getAllShowtimes().then(setshowtimes);
    getAllRooms().then(setRooms);
    getAllMovies().then((data) => {
      setMovies(data);
    });
  }, []);

  // RELOAD
  const reload = async () => {
    try {
      const data = await getAllShowtimes();
      setshowtimes(data);
    } catch (err) {
      console.error(err);
    }
  };

  // SEARCH
  const searchshowtimes = async () => {
    const data = await searchShowtimes(keyword);
    setshowtimes(data);
  };

  // INSERT
  const Insertshowtimes = async () => {
    try {
      const res = await insertShowtimes(
        movie_id,
        room_id,
        show_date,
        start_time,
        end_time,
        format,
        price,
      );
      alert(res.message);
      setshowtimes(await getAllShowtimes());
      setshowmodual(false);
      setMovieId("");
      setRoomId("");
      setShowDate("");
      setStartTime("");
      setEndTime("");
      setFormat("2D");
      setPrice("");
    } catch (err) {
      console.error(err);
      alert("Thêm thất bại");
    }
  };

  // UPDATE
  const Updateshowtimes = async () => {
    if (!updateshow) return;
    try {
      const res = await updateShowtimes(updateshow);
      alert(res.message);
      setshowtimes(await getAllShowtimes());
      setupdate(false);
      setupdateshow(null);
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại");
    }
  };

  // DELETE
  const deleteshowtimes = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa không")) return;
    try {
      const res = await deleteShowtimes(id);
      alert(res.message);
      setshowtimes(showtimes.filter((s) => s.showtime_id !== id));
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="ml-10 p-10">
      <div className="h-10 w-60 bg-amber-400 mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý suất chiếu phim
      </div>

      <div className="flex mb-10">
        <div className="flex">
          <input
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            type="text"
            placeholder="Tìm kiếm lịch chiếu phim"
            className="w-[400px] pl-5 h-8 mr-15 rounded outline-none border-b border-gray-400
            focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
          />
          <button
            onClick={searchshowtimes}
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
            + Thêm lịch chiếu phim
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse">
            <thead className="bg-gray-100 uppercase text-sm text-black sticky top-0">
              <tr>
                <th className="p-3">Mã lịch chiếu</th>
                <th className="p-3">Mã phim</th>
                <th className="p-3">Mã phòng</th>
                <th className="p-3">Ngày chiếu</th>
                <th className="p-3">Giờ bắt đầu</th>
                <th className="p-3">Giờ kết thúc</th>
                <th className="p-3">Định dạng chiếu</th>
                <th className="p-3">Giá vé</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {showtimes.map((s) => (
                <tr key={s.showtime_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{s.showtime_id}</td>
                  <td className="p-3">{s.movie_id}</td>
                  <td className="p-3">{s.room_id}</td>
                  <td className="p-3">{s.show_date?.split("T")[0]}</td>
                  <td className="p-3">{s.start_time}</td>
                  <td className="p-3">{s.end_time}</td>
                  <td className="p-3">{s.format}</td>
                  <td className="p-3">{s.price}</td>
                  <td className="p-3">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setupdate(true);
                        setupdateshow(s);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteshowtimes(s.showtime_id)}
                      className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADD MODAL */}
        {showmodual && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] text-black">
              <h2 className="text-xl flex justify-center font-semibold mb-4">
                Thêm suất chiếu phim
              </h2>
              <h3 className="capitalize">Mã phim:</h3>
              <select
                value={movie_id}
                onChange={(e) => setMovieId(e.target.value)}
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">-- Chọn phim --</option>

                {movies.map((movie) => (
                  <option key={movie.movie_id} value={movie.movie_id}>
                    {movie.title}
                  </option>
                ))}
              </select>

              <h3 className="capitalize">Chọn phòng:</h3>
              <select
                value={room_id}
                onChange={(e) => setRoomId(e.target.value)}
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>
                    Phòng {r.room_id}
                  </option>
                ))}
              </select>

              <h3 className="capitalize">Ngày chiếu:</h3>
              <input
                value={show_date}
                onChange={(e) => setShowDate(e.target.value)}
                type="date"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Giờ bắt đầu:</h3>
              <input
                value={start_time}
                onChange={(e) => setStartTime(e.target.value)}
                type="time"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Giờ kết thúc:</h3>
              <input
                value={end_time}
                onChange={(e) => setEndTime(e.target.value)}
                type="time"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Định dạng chiếu:</h3>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>

              <h3 className="capitalize">Giá vé:</h3>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <div className="flex justify-center">
                <button
                  onClick={() => setshowmodual(false)}
                  className="w-30 bg-blue-300 m-4 h-8 capitalize hover:bg-blue-500 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={Insertshowtimes}
                  className="w-30 bg-blue-500 m-4 h-8 capitalize hover:bg-blue-700 rounded-lg"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UPDATE MODAL */}
        {showupdate && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="w-[400px] bg-white text-black rounded-lg p-6">
              <h2 className="flex justify-center font-bold uppercase mb-4">
                Sửa suất chiếu phim
              </h2>
              <h3 className="capitalize">Mã phim:</h3>
              <select
                value={updateshow?.movie_id}
                onChange={(e) =>
                  setupdateshow({
                    ...updateshow!,
                    movie_id: Number(e.target.value),
                  })
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">-- Chọn phim --</option>

                {movies.map((movie) => (
                  <option key={movie.movie_id} value={movie.movie_id}>
                    {movie.title}
                  </option>
                ))}
              </select>

              <h3 className="capitalize">Chọn phòng:</h3>
              <select
                value={updateshow?.room_id}
                onChange={(e) =>
                  setupdateshow({
                    ...updateshow!,
                    room_id: Number(e.target.value),
                  })
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">-- Chọn phòng --</option>
                {rooms.map((r) => (
                  <option key={r.room_id} value={r.room_id}>
                    Phòng {r.room_id}
                  </option>
                ))}
              </select>

              <h3 className="capitalize">Ngày chiếu:</h3>
              <input
                value={updateshow?.show_date?.split("T")[0]}
                onChange={(e) =>
                  setupdateshow({ ...updateshow!, show_date: e.target.value })
                }
                type="date"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Giờ bắt đầu:</h3>
              <input
                value={updateshow?.start_time}
                onChange={(e) =>
                  setupdateshow({ ...updateshow!, start_time: e.target.value })
                }
                type="time"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Giờ kết thúc:</h3>
              <input
                value={updateshow?.end_time}
                onChange={(e) =>
                  setupdateshow({ ...updateshow!, end_time: e.target.value })
                }
                type="time"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Định dạng chiếu:</h3>
              <select
                value={updateshow?.format}
                onChange={(e) =>
                  setupdateshow({
                    ...updateshow!,
                    format: e.target.value as "2D" | "3D" | "IMAX",
                  })
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
              </select>

              <h3 className="capitalize">Giá vé:</h3>
              <input
                value={updateshow?.price}
                onChange={(e) =>
                  setupdateshow({
                    ...updateshow!,
                    price: Number(e.target.value),
                  })
                }
                type="number"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <div className="flex justify-center">
                <button
                  onClick={() => setupdate(false)}
                  className="bg-blue-400 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                >
                  Hủy
                </button>
                <button
                  onClick={Updateshowtimes}
                  className="bg-blue-500 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                >
                  Sửa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
