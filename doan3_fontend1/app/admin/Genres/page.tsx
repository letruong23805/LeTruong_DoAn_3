"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import {
  Genres,
  getAllGenres,
  searchGenres,
  insertGenre,
  updateGenre,
  deleteGenre,
} from "@/services/genres";

// type Genres = {
//   genre_id: number;
//   genre_name: string;
// };

export default function QLphong() {
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);

  const [genres, setgenres] = useState<Genres[]>([]);
  useEffect(() => {
    getAllGenres().then(setgenres);
  }, []);
  const reload = async () => {
    try {
      const data = await getAllGenres();
      setgenres(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [keyword, setkeyword] = useState("");

  // SEARCH
  const search = async () => {
    const data = await searchGenres(keyword);
    setgenres(data);
  };

  const [name, setname] = useState("");

  // INSERT
  const Insertgenres = async () => {
    try {
      const res = await insertGenre(name);
      alert(res.message);

      setgenres(await getAllGenres());
      setshowmodual(false);
      setname("");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Thêm thất bại");
      }
    }
  };

  const [updateData, setupdategenres] = useState<Genres | null>(null);

  // UPDATE
  const UpdateGenres = async () => {
    try {
      if (!updateData) return;

      const res = await updateGenre(updateData.genre_id, updateData.genre_name);

      alert(res.message);

      setgenres(await getAllGenres());
      setupdate(false);
      setupdategenres(null);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Sửa thất bại");
      }
    }
  };
  // DELETE
  const deletegenres = async (id: number) => {
    try {
      const confirmDelete = confirm("Bạn có chắc muốn xóa không?");
      if (!confirmDelete) return;

      await deleteGenre(id);

      const newdata = await getAllGenres();
      setgenres(newdata);
    } catch (err) {
      console.error(err);
      alert("Xóa loại phim thất bại");
    }
  };

  return (
    <div className=" ml-10 p-10 ">
      <div className=" h-10 w-60 bg-amber-400  mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý loại phim
      </div>
      <div>
        <div className="flex mb-10">
          <div className="flex">
            <input
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              type="text"
              placeholder="Tìm kiếm loại phim"
              className=" w-[400px] pl-5 h-8 mr-15  rounded outline-none  border-b border-gray-400
            focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
            />
            <button
              onClick={search}
              className="bg-blue-600 hover:bg-blue-700 w-25 h-8 rounded cursor-pointer"
            >
              Tìm kiếm
            </button>
            <RefreshCw
              onClick={reload}
              className=" ml-12 bg-blue-600 w-20 h-8 rounded-lg cursor-pointer"
            ></RefreshCw>
          </div>

          <div className="flex ml-60 ">
            <button
              onClick={() => setshowmodual(true)}
              className="capitalize h-8 w-50 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
            >
              +Thêm loại phim
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className=" max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse ">
            <thead className="bg-gray-100 uppercase text-sm text-black">
              <tr>
                <th className="p-3">id loại phim</th>
                <th className="p-3">tên phim</th>
                <th className="p-3 text-center">Thao tác </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {genres.map((g) => (
                <tr key={g.genre_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{g.genre_id}</td>
                  <td className="p-3">{g.genre_name}</td>

                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setupdate(true);
                        setupdategenres(g);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deletegenres(g.genre_id)}
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
                Thêm loại phim
              </h2>

              <h3 className="capitalize">Tên thể loại:</h3>

              <input
                value={name}
                onChange={(e) => setname(e.target.value)}
                type="text"
                placeholder="Nhập tên thể loại phim"
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
                  onClick={Insertgenres}
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
                Sửa Thể loại phim
              </h2>

              <h3 className="capitalize">Tên thể loại:</h3>

              <input
                value={updateData?.genre_name}
                onChange={(e) =>
                  setupdategenres({
                    ...updateData!,
                    genre_name: e.target.value,
                  })
                }
                type="text"
                placeholder="Nhập tên thể loại phim"
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
                  onClick={UpdateGenres}
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
