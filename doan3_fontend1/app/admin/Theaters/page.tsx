"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import {
  Theater,
  getall,
  search,
  inserttheaters,
  updatetheaters,
  deletetheaters,
} from "@/services/theaters";
import { getAllTheaters } from "@/services/rooms";

// type Theater = {
//   theater_id: number;
//   name: string;
//   address: string;
//   phone: string;
//   created_at: string;
// };

export default function QLRap() {
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);

  const [theaters, setTheaters] = useState<Theater[]>([]);

  const reload = async () => {
    try {
      const data = await getall();
      setTheaters(data);
    } catch (err) {
      console.error(err);
    }
  };

  // LOAD
  useEffect(() => {
    getAllTheaters().then(setTheaters);
  }, []);

  const [keyword, setkeyword] = useState("");

  // SEARCH
  const searchTheater = async () => {
    const data = await search(keyword);
    setTheaters(data);
  };

  const [name, setname] = useState("");
  const [address, setaddress] = useState("");
  const [phone, setphone] = useState("");

  // INSERT
  const InsertTheater = async () => {
    try {
      const res = await inserttheaters(name, address, phone);
      alert(res.message);

      const newdata = await getall();
      setTheaters(newdata);

      setshowmodual(false);
      setname("");
      setaddress("");
      setphone("");
    } catch (err) {
      console.error(err);
      alert("Thêm rạp thất bại");
    }
  };

  const [updateData, setupdateTheater] = useState<Theater | null>(null);

  // UPDATE
  const UpdateTheater = async () => {
    try {
      if (!updateData) return;

      await updatetheaters(
        updateData.theater_id,
        updateData.name,
        updateData.address,
        updateData.phone,
      );

      const newdata = await getall();
      setTheaters(newdata);

      setupdate(false);
      setupdateTheater(null);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    }
  };

  // DELETE
  const deleteTheater = async (id: number) => {
    try {
      const confirmDelete = confirm("Bạn có chắc muốn xóa không?");
      if (!confirmDelete) return;

      await deletetheaters(id);

      const newdata = await getall();
      setTheaters(newdata);
    } catch (err) {
      console.error(err);
      alert("Xóa rạp thất bại");
    }
  };

  return (
    <div className=" ml-10 p-10 ">
      <div className=" h-10 w-60 bg-amber-400  mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý rạp chiếu phim
      </div>
      <div>
        <div className="flex mb-10">
          <div className="flex">
            <input
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              type="text"
              placeholder="Tìm kiếm rạp chiếu phim"
              className=" w-[400px] pl-5 h-8 mr-15  rounded outline-none  border-b border-gray-400
            focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
            />
            <button
              onClick={searchTheater}
              className="bg-blue-600 hover:bg-blue-700 w-25 h-8 rounded cursor-pointer"
            >
              Tìm kiếm
            </button>
            <RefreshCw
              onClick={reload}
              className=" ml-12 bg-blue-600 w-20 h-8 rounded-lg cursor-pointer"
            ></RefreshCw>
          </div>

          <div className="flex ml-80 ">
            <button
              onClick={() => setshowmodual(true)}
              className="capitalize h-8 w-30 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
            >
              +Thêm rạp phim
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse ">
            <thead className="bg-gray-100 uppercase text-sm text-black">
              <tr>
                <th className="p-3">id</th>
                <th className="p-3">tên rạp</th>
                <th className="p-3">địa chỉ</th>
                <th className="p-3">số điện thoại</th>
                <th className="p-3">ngày tạo</th>
                <th className="p-3 text-center">thao tác</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {theaters.map((t) => (
                <tr key={t.theater_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.theater_id}</td>
                  <td className="p-3">{t.name}</td>
                  <td className="p-3">{t.address}</td>
                  <td className="p-3">{t.phone}</td>
                  <td className="p-3">{t.created_at}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setupdate(true);
                        setupdateTheater(t);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteTheater(t.theater_id)}
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
            <div className="bg-white p-6 rounded-lg w-[400px]  text-black">
              <h2 className="text-xl flex justify-center font-semibold mb-4">
                Thêm rạp chiếu phim
              </h2>

              <h3 className="capitalize">Tên rạp:</h3>
              <input
                value={name}
                onChange={(e) => setname(e.target.value)}
                type="text"
                placeholder="Nhập tên rạp chiếu"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Địa chỉ:</h3>
              <input
                value={address}
                onChange={(e) => setaddress(e.target.value)}
                type="text"
                placeholder="Nhập địa chỉ"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Số điện thoại:</h3>
              <input
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                type="text"
                placeholder="Nhập số điện thoại"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <div className="flex justify-center">
                <button
                  onClick={() => setshowmodual(false)}
                  className="w-30 bg-blue-300 m-4 h-8 capitalize hover:bg-blue-500 rounded-lg"
                >
                  hủy
                </button>
                <button
                  onClick={InsertTheater}
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
                Sửa rạp chiếu phim
              </h2>

              <h3 className="capitalize">Tên rạp:</h3>
              <input
                value={updateData?.name}
                onChange={(e) =>
                  setupdateTheater({ ...updateData!, name: e.target.value })
                }
                type="text"
                placeholder="Nhập tên rạp chiếu"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Địa chỉ:</h3>
              <input
                value={updateData?.address}
                onChange={(e) =>
                  setupdateTheater({ ...updateData!, address: e.target.value })
                }
                type="text"
                placeholder="Nhập địa chỉ"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />

              <h3 className="capitalize">Số điện thoại:</h3>
              <input
                value={updateData?.phone}
                onChange={(e) =>
                  setupdateTheater({ ...updateData!, phone: e.target.value })
                }
                type="text"
                placeholder="Nhập số điện thoại"
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
                  onClick={UpdateTheater}
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
