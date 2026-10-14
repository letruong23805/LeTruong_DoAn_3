"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Room,
  Theater,
  getAllTheaters,
  getAllRooms,
  searchRoomByName,
  insertRoom,
  updateRoom,
  deleteRoom,
} from "@/services/rooms";
import { createSeatsAuto } from "@/services/seats";

export default function QLphong() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [rooms, setrooms] = useState<Room[]>([]);
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);
  const [keyword, setkeyword] = useState("");
  const [theater_id, settheater_id] = useState<number | "">("");
  const [room_name, setroom_name] = useState("");
  const [total_seats, settotal_seats] = useState<number | "">("");
  const [editRoom, setEditRoom] = useState<Room | null>(null);

  useEffect(() => {
    getAllTheaters().then(setTheaters);
    getAllRooms().then(setrooms);
  }, []);

  const reload = async () => {
    try {
      const data = await getAllRooms();
      setrooms(data);
    } catch (err) {
      console.log(err);
    }
  };

  const searchroom = async () => {
    const data = await searchRoomByName(keyword);
    setrooms(data);
  };

  const handleInsertRoom = async () => {
    try {
      // thêm phòng
      const data = await insertRoom(
        theater_id as number,
        room_name,
        total_seats as number,
      );

      // lấy room_id vừa tạo
      const room_id = data.Roms.insertId;

      // tự động tạo ghế
      await createSeatsAuto(room_id, total_seats as number);

      alert("Thêm phòng và tạo ghế thành công");

      setrooms(await getAllRooms());

      setshowmodual(false);

      settheater_id("");
      setroom_name("");
      settotal_seats("");
    } catch (error) {
      console.error(error);
      alert("Thêm phòng thất bại");
    }
  };

  const handleUpdateRoom = async () => {
    try {
      const data = await updateRoom(editRoom!);
      alert(data.message);
      setrooms(await getAllRooms());
      setupdate(false);
      setEditRoom(null);
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại");
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phòng này không")) return;
    try {
      const data = await deleteRoom(id);
      alert(data.message);
      setrooms(rooms.filter((room) => room.room_id !== id));
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="ml-10 p-10">
      <div className="h-10 w-60 bg-amber-400 mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý phòng chiếu phim
      </div>

      <div className="flex mb-10">
        <div className="flex">
          <input
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            type="text"
            placeholder="Tìm kiếm phòng chiếu phim"
            className="w-[400px] pl-5 h-8 mr-15 rounded outline-none border-b border-gray-400 focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
          />
          <button
            onClick={searchroom}
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
            + Thêm phòng chiếu phim
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse">
            <thead className="bg-gray-100 uppercase text-sm text-black">
              <tr>
                <th className="p-3">id</th>
                <th className="p-3">id rạp</th>
                <th className="p-3">Tên phòng</th>
                <th className="p-3">Tổng số ghế</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {rooms.map((room) => (
                <tr key={room.room_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{room.room_id}</td>
                  <td className="p-3">{room.theater_id}</td>
                  <td className="p-3">{room.room_name}</td>
                  <td className="p-3">{room.total_seats}</td>
                  <td className="p-3">
                    {new Date(room.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setEditRoom(room);
                        setupdate(true);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteRoom(room.room_id)}
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

        {/* Modal Thêm */}
        {showmodual && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] text-black">
              <h2 className="text-xl flex justify-center font-semibold mb-4">
                Thêm phòng chiếu phim
              </h2>
              <h3 className="capitalize">theater_id:</h3>
              <select
                value={theater_id}
                onChange={(e) =>
                  settheater_id(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value=""></option>
                {theaters.map((t) => (
                  <option key={t.theater_id} value={t.theater_id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <h3 className="capitalize">room_name:</h3>
              <input
                value={room_name}
                onChange={(e) => setroom_name(e.target.value)}
                type="text"
                placeholder="Tên phòng"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3 className="capitalize">total_seats:</h3>
              <input
                type="text"
                value={total_seats}
                onChange={(e) => settotal_seats(Number(e.target.value))}
                placeholder="Tổng số ghế"
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
                  onClick={handleInsertRoom}
                  className="w-30 bg-blue-500 m-4 h-8 capitalize hover:bg-blue-700 rounded-lg"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sửa */}
        {showupdate && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="w-[400px] bg-white text-black rounded-lg p-6">
              <h2 className="flex justify-center font-bold uppercase">
                Sửa thông tin phòng chiếu
              </h2>
              <h3 className="capitalize my-2">theater_id</h3>
              <input
                value={editRoom?.theater_id}
                onChange={(e) =>
                  setEditRoom({
                    ...editRoom!,
                    theater_id: Number(e.target.value),
                  })
                }
                className="pl-3 border rounded-lg w-full py-1"
                type="text"
                placeholder="Nhập id rạp chiếu"
              />
              <h3 className="capitalize my-2">room_name</h3>
              <input
                value={editRoom?.room_name}
                onChange={(e) =>
                  setEditRoom({ ...editRoom!, room_name: e.target.value })
                }
                className="pl-3 border rounded-lg w-full py-1"
                type="text"
                placeholder="Nhập tên phòng chiếu"
              />
              <h3 className="capitalize my-2">total_seats</h3>
              <input
                value={editRoom?.total_seats}
                onChange={(e) =>
                  setEditRoom({
                    ...editRoom!,
                    total_seats: Number(e.target.value),
                  })
                }
                className="pl-3 border rounded-lg w-full py-1"
                type="text"
                placeholder="Nhập số ghế"
              />
              <div className="flex justify-center">
                <button
                  onClick={() => setupdate(false)}
                  className="bg-blue-400 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateRoom}
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
