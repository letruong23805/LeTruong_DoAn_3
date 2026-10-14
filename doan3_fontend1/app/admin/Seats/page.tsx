"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Seat,
  getallseats,
  searchseats,
  insertseats,
  updateseats,
  deleteseats,
} from "@/services/seats";
// type Seat = {
//   seat_id: number;
//   room_id: number;
//   seat_number: string;
//   seat_type: "normal" | "vip";
//   created_at: string;
// };
export default function QLghe() {
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setshowupdate] = useState(false);

  const [seats, setSeats] = useState<Seat[]>([]);

  const reload = async () => {
    try {
      const data = await getallseats();
      setSeats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getallseats().then(setSeats);
  }, []);
  const [keyword, setkeyword] = useState("");
  const Searchseats = async () => {
    try {
      const data = await searchseats(keyword);
      setSeats(data);
    } catch (err) {
      console.log("Lỗi tìm kiếm", err);
    }
  };
  const [Room_id, setRoom_id] = useState<number | "">("");
  const [Seat_number, setSeat_number] = useState("");
  const [Seat_type, setSeat_type] = useState<"normal" | "vip">("normal");
  const Insertseats = async () => {
    try {
      if (!Room_id || !Seat_number) {
        alert("Không được để trống");
        return;
      }

      const res = await insertseats(Room_id as number, Seat_number, Seat_type);
      alert(res.message);
      const newdata = await getallseats();
      setSeats(newdata);
      setRoom_id("");
      setSeat_number("");
      setSeat_type("normal");
      setshowmodual(false);
    } catch (error) {
      console.error(error);
      alert("Thêm ghế thất bại");
    }
  };
  const [updateData, setupdateseats] = useState<Seat | null>(null);
  const Updateseats = async () => {
    try {
      if (!updateData) return;
      const res = await updateseats(
        updateData.seat_id,
        updateData.room_id,
        updateData.seat_number,
        updateData.seat_type,
      );
      alert(res.message);
      const newdata = await getallseats();
      setSeats(newdata);
      setshowupdate(false);
      setupdateseats(null);
    } catch (error) {
      console.error(error);
      alert("Sửa thất bại");
    }
  };
  const Deleteseats = async (id: number) => {
    const confri = confirm("Bạn có chắc chắn muốn xóa ghế ko ");
    if (!confri) return;
    try {
      const res = await deleteseats(id);
      alert(res.message);
      const newdata = await getallseats();
      setSeats(newdata);
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };
  return (
    <div className=" ml-10 p-10 ">
      <div className=" h-10 w-60 bg-amber-400  mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý ghế ngồi
      </div>
      <div>
        <div className="flex mb-10">
          <div className="flex">
            <input
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              type="text"
              placeholder="Tìm kiếm ghế"
              className=" w-[400px] pl-5 h-8 mr-15  rounded outline-none  border-b border-gray-400
            focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
            />
            <button
              onClick={Searchseats}
              className="bg-blue-600 hover:bg-blue-700 w-25 h-8 rounded cursor-pointer"
            >
              Tìm kiếm
            </button>
            <RefreshCw
              onClick={reload}
              className=" ml-12 bg-blue-600 w-20 h-8 rounded-lg cursor-pointer"
            ></RefreshCw>
          </div>

          <div className="flex ml-70 ">
            <button
              onClick={() => setshowmodual(true)}
              className="capitalize h-8 w-50 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
            >
              +Thêm ghế ngồi
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse ">
            <thead className="bg-gray-100 uppercase text-sm text-black sticky top-0">
              <tr>
                <th className="p-3">id Ghế</th>
                <th className="p-3">id phòng</th>
                <th className="p-3">số ghế</th>
                <th className="p-3">loại ghế</th>
                <th className="p-3">ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {seats.map((seat) => (
                <tr key={seat.seat_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{seat.seat_id}</td>
                  <td className="p-3">{seat.room_id}</td>
                  <td className="p-3">{seat.seat_number}</td>
                  <td className="p-3">{seat.seat_type}</td>
                  <td className="p-3">{seat.created_at}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setupdateseats(seat);
                        setshowupdate(true);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => Deleteseats(seat.seat_id)}
                      className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ADD MODAL */}
          {showmodual && (
            <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-[400px]  text-black">
                <h2 className="text-xl flex justify-center font-semibold mb-4">
                  Thêm Ghế
                </h2>

                <h3 className="capitalize">Mã phòng:</h3>
                <input
                  value={Room_id}
                  onChange={(e) => setRoom_id(Number(e.target.value))}
                  type="text"
                  placeholder="Nhập mã phòng"
                  className="border my-1 p-1 pl-2 rounded-lg w-full"
                />

                <h3 className="capitalize">Số ghế:</h3>
                <input
                  value={Seat_number}
                  onChange={(e) => setSeat_number(e.target.value)}
                  type="text"
                  placeholder="Nhập số lượng ghế ngồi"
                  className="border my-1 p-1 pl-2 rounded-lg w-full"
                />

                <h3 className="capitalize">Loại ghế:</h3>
                <select
                  value={Seat_type}
                  onChange={(e) =>
                    setSeat_type(e.target.value as "normal" | "vip")
                  }
                  className="w-full border my-1 p-1 pl-2 rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="vip">VIP</option>
                </select>

                <div className="flex justify-center">
                  <button
                    onClick={() => setshowmodual(false)}
                    className="w-30 bg-blue-300 m-4 h-8 capitalize hover:bg-blue-500 rounded-lg"
                  >
                    hủy
                  </button>
                  <button
                    onClick={Insertseats}
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
                <h2 className="flex justify-center font-bold uppercase">
                  Sửa ghế
                </h2>

                <h3 className="capitalize">Mã phòng:</h3>
                <input
                  value={updateData?.room_id || ""}
                  onChange={(e) =>
                    setupdateseats({
                      ...updateData!,
                      room_id: Number(e.target.value),
                    })
                  }
                  type="text"
                  placeholder="Nhập mã phòng"
                  className="border my-1 p-1 pl-2 rounded-lg w-full"
                />

                <h3 className="capitalize">Số ghế:</h3>
                <input
                  value={updateData?.seat_number || ""}
                  onChange={(e) =>
                    setupdateseats({
                      ...updateData!,
                      seat_number: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Nhập số lượng ghế ngồi"
                  className="border my-1 p-1 pl-2 rounded-lg w-full"
                />

                <h3 className="capitalize">Loại ghế:</h3>
                <select
                  value={updateData?.seat_type || "normal"}
                  onChange={(e) =>
                    setupdateseats({
                      ...updateData!,
                      seat_type: e.target.value as "normal" | "vip",
                    })
                  }
                  className="w-full border my-1 p-1 pl-2 rounded-lg"
                >
                  <option value="normal">Normal</option>
                  <option value="vip">VIP</option>
                </select>

                <div className="flex justify-center">
                  <button
                    onClick={() => setshowupdate(false)}
                    className="bg-blue-400 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={Updateseats}
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
    </div>
  );
}
