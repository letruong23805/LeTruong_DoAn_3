"use client";
import { RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import {
  MovieDetails,
  MovieDetailForm,
  getidDetails,
  getallDetails,
  Insertdetails,
  Updatedetails,
  Deletedetails,
} from "@/services/moviedetails";
type Movies = {
  movie_id: number;
  title: string;
  duration: number;
  release_date: string;
  poster: string;
  genre_id: number;
  status: string;
  created_at: string;
  genres: string;
  genre_ids: string;
};

type MovieForm = {
  Title: string;
  Duration: string;
  Release_date: string;
  Genre_ids: string[];
  Status: "coming" | "showing" | "ended";
};
type Genres = {
  genre_id: number;
  genre_name: string;
};
export default function QLphim() {
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);
  const [showmodchitiet, setshowmodchitiet] = useState(false);
  const [showmodualchitiet, setshowmodualchitiet] = useState(false);
  const [showupdatechitiet, setupdatechitiet] = useState(false);
  const [moviedetails, setmoviedetails] = useState<MovieDetails[]>([]);
  const [genres, setGenres] = useState<Genres[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/genres/all")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.log(err));
  }, []);
  const [movies, setmovies] = useState<Movies[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/movies/all")
      .then((res) => res.json())
      .then((data) => setmovies(data))
      .catch((err) => console.log(err));
  }, []);

  const reload = async () => {
    try {
      const res = await fetch("http://localhost:3000/movies/all");
      const data = await res.json();
      setmovies(data);
    } catch (err) {
      console.log(err);
    }
  };
  const [keyword, setkeyword] = useState("");
  const searchmovies = async () => {
    if (!keyword.trim()) {
      fetch("http://localhost:3000/movies/all")
        .then((res) => res.json())
        .then((data) => setmovies(data));
    } else {
      fetch(`http://localhost:3000/movies/name?name=${keyword}`)
        .then((res) => res.json())
        .then((data) => setmovies(data))
        .catch((err) => console.log(err));
    }
  };

  const [form, setForm] = useState<MovieForm>({
    Title: "",
    Duration: "",
    Release_date: "",
    Genre_ids: [],
    Status: "coming",
  });

  const [posterFile, setPosterFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPosterFile(e.target.files[0]);
    }
  };
  const Insertmovies = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("Title", form.Title);
      formData.append("Duration", form.Duration);
      formData.append("Release_date", form.Release_date);
      formData.append("Status", form.Status);

      form.Genre_ids.forEach((id) => {
        formData.append("Genre_ids[]", id);
      });

      if (posterFile) {
        formData.append("Poster", posterFile);
      }

      const res = await fetch("http://localhost:3000/movies/insert", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      // reload lại danh sách
      const reload = await fetch("http://localhost:3000/movies/all");
      const newData = await reload.json();
      setmovies(newData);

      // reset form
      setForm({
        Title: "",
        Duration: "",
        Release_date: "",
        Genre_ids: [],
        Status: "coming",
      });

      setPosterFile(null);
      setshowmodual(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [updatemovies, setupdatemovie] = useState<Movies | null>(null);
  const handleEdit = (movie: Movies) => {
    setupdatemovie(movie);

    setForm({
      Title: movie.title,
      Duration: movie.duration.toString(),
      Release_date: movie.release_date?.split("T")[0],
      Genre_ids: movie.genre_ids ? movie.genre_ids.split(",") : [],
      Status: movie.status as "coming" | "showing" | "ended",
    });

    setupdate(true);
  };
  const updatemovie = async () => {
    if (!updatemovies) return;
    try {
      const token = localStorage.getItem("token");
      const fromdata = new FormData();

      fromdata.append("Title", form.Title);
      fromdata.append("Duration", form.Duration);
      fromdata.append("Release_date", form.Release_date);
      fromdata.append("Status", form.Status);

      form.Genre_ids.forEach((id) => {
        fromdata.append("Genre_ids[]", id);
      });
      if (posterFile) {
        fromdata.append("Poster", posterFile);
      }
      const res = await fetch(
        `http://localhost:3000/movies/update/${updatemovies.movie_id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: fromdata,
        },
      );
      const data = await res.json();
      alert("Cập nhật thành công");

      const reload = await fetch("http://localhost:3000/movies/all");
      const newdata = await reload.json();
      setmovies(newdata);
      setupdate(false);
      setupdatemovie(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deletemovies = async (id: number) => {
    const loichao = confirm("bạn có chắc chắn muốn xóa phim này không");
    if (!loichao) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/movies/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message); // 👈 hiển thị lỗi từ backend
        return;
      }
      alert(data.message);

      const reload = await fetch("http://localhost:3000/movies/all");
      const newdata = await reload.json();
      setmovies(newdata);
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };
  const getallmoviesdetails = async (movie_id: number) => {
    try {
      const data = await getidDetails(movie_id);
      setmoviedetails(data);
    } catch (err) {
      console.log(err);
    }
  };
  const reloadmoviesdatile = async () => {
    try {
      const data = await getallDetails();
      setmoviedetails(data);
    } catch (err) {
      console.error(err);
    }
  };

  const [detailForm, setDetailForm] = useState<MovieDetailForm>({
    Movie_id: "",
    Description: "",
    Trailer_url: "",
    Country: "",
    Director: "",
    Actors: "",
  });
  const handleDetailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setDetailForm({
      ...detailForm,
      [e.target.name]: e.target.value,
    });
  };
  const Insertmoviesdetails = async () => {
    try {
      const data = await Insertdetails(detailForm);
      alert(data.message);
      getallmoviesdetails(Number(detailForm.Movie_id));

      setDetailForm({
        Movie_id: "",
        Description: "",
        Trailer_url: "",
        Country: "",
        Director: "",
        Actors: "",
      });

      setshowmodualchitiet(false);
    } catch (err) {
      console.error(err);
      alert("Thêm chi tiết phim thất bại");
    }
  };
  const [updatedetail, setupdatedetail] = useState<MovieDetails | null>(null);
  const handleEditDetail = (md: MovieDetails) => {
    setupdatedetail(md);

    setDetailForm({
      Movie_id: md.movie_id.toString(),
      Description: md.description,
      Trailer_url: md.trailer_url,
      Country: md.country,
      Director: md.director,
      Actors: md.actors,
    });

    setupdatechitiet(true);
  };
  const updatedetailsmovie = async () => {
    if (!updatedetail) return;
    try {
      const data = await Updatedetails(
        detailForm,
        updatedetail.movie_detail_id,
      );
      alert(data.message);
      await getallmoviesdetails(Number(detailForm.Movie_id));
      setupdatechitiet(false);

      setupdatedetail(null);

      setDetailForm({
        Movie_id: "",
        Description: "",
        Trailer_url: "",
        Country: "",
        Director: "",
        Actors: "",
      });
    } catch (err) {
      console.error(err);
      alert("Sửa chi tiết phim thất bại");
    }
  };
  const deletedetailmovie = async (id: number, movie_id: number) => {
    const check = confirm("Bạn có chắc muốn xóa chi tiết phim này không?");
    if (!check) return;
    try {
      const data = await Deletedetails(id);
      alert(data.message);
      await getallmoviesdetails(movie_id);
    } catch (err) {
      console.error(err);
      alert("Xóa chi tiết thất bại");
    }
  };
  return (
    <div className=" ml-0 p-5 ">
      <div className=" h-10 w-60 bg-amber-400  mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý phim
      </div>
      <div>
        <div className="flex mb-10 ">
          <div className="flex">
            <input
              value={keyword}
              onChange={(e) => setkeyword(e.target.value)}
              type="text"
              placeholder="Tìm kiếm phim"
              className=" w-[400px] pl-5 h-8 mr-15  rounded outline-none  border-b border-gray-400
            focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
            />
            <button
              onClick={searchmovies}
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
              +Thêm phim{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse ">
            <thead className="bg-gray-100 uppercase text-sm text-black sticky top-0 ">
              <tr>
                <th className="p-3">Mã phim</th>
                <th className="p-3">Tên phim</th>
                <th className="p-3">Thời lượng (phút)</th>
                <th className="p-3">Ngày phát hành</th>
                <th className="p-3">Ảnh poster</th>
                <th className="p-3">Mã thể loại</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">ngày tạo </th>
                <th className="p-3 text-center">thao tác </th>
              </tr>
            </thead>
            <tbody className="text-black">
              {movies.map((m) => (
                <tr key={m.movie_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{m.movie_id}</td>
                  <td className="p-3">{m.title}</td>

                  <td className="p-3">{m.duration}</td>
                  <td className="p-3">
                    {new Date(m.release_date).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <img
                      src={`http://localhost:3000${m.poster}`}
                      alt=""
                      className="w-16 h-20 object-cover rounded"
                    />
                  </td>

                  <td>
                    {m.genres?.split(",").map((g: string, i: number) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-600 px-2 py-1 mr-1 rounded text-sm"
                      >
                        {g}
                      </span>
                    ))}
                  </td>
                  <td className="p-3">
                    {m.status === "coming" && (
                      <span className="text-yellow-500">Sắp chiếu</span>
                    )}
                    {m.status === "showing" && (
                      <span className="text-green-500">Đang chiếu</span>
                    )}
                    {m.status === "ended" && (
                      <span className="text-red-500">Đã kết thúc</span>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(m.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-center space-x-2 flex flex-col">
                    <button
                      onClick={() => handleEdit(m)}
                      className="w-18 py-1 mb-1  bg-yellow-400 rounded hover:bg-yellow-500 text-white cursor-pointer"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deletemovies(m.movie_id)}
                      className="w-18 py-1 mt-1  bg-red-500 rounded hover:bg-red-600 text-white cursor-pointer"
                    >
                      Xóa
                    </button>
                    <button
                      onClick={() => {
                        setshowmodchitiet(true);
                        getallmoviesdetails(m.movie_id);
                      }}
                      className="w-18 py-1 mt-1 bg-green-500 rounded-lg text-white capitalize cursor-pointer"
                    >
                      chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showmodual && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-[400px]  text-black capitalize">
            <h2 className="text-xl flex justify-center font-semibold mb-4">
              Thêm phim
            </h2>

            <h3 className="capitalize">Tên phim:</h3>
            <input
              name="Title"
              onChange={handleChange}
              type="text"
              placeholder="Tên phim"
              className="border my-1 p-1 pl-2 rounded-lg w-full"
            />

            <div className="flex">
              <div className="flex flex-col mr-4">
                <h3>Thời lượng (Phút)</h3>
                <input
                  name="Duration"
                  onChange={handleChange}
                  type="text"
                  className="border my-1 p-1 pl-2 rounded-lg w-40 "
                />
              </div>
              <div className="flex flex-col ml-4">
                <h3>Ngày phát hành</h3>
                <input
                  name="Release_date"
                  onChange={handleChange}
                  type="date"
                  className="border my-1 p-1 pl-2 rounded-lg w-40 "
                />
              </div>
            </div>

            <div className="flex">
              <div className=" flex flex-col mr-4">
                <h3>đường dẫn ảnh poster</h3>
                <input
                  onChange={handleFileChange}
                  type="file"
                  className="border my-1 p-1 pl-2 rounded-lg w-40 "
                />
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col mr-4">
                <h3>Thể loại </h3>
                <select
                  multiple
                  name="Genre_ids"
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value,
                    );
                    setForm({
                      ...form,
                      Genre_ids: selected,
                    });
                  }}
                  className="border my-1 p-1 pl-2 rounded-lg w-40 h-24"
                >
                  {genres.map((g) => (
                    <option key={g.genre_id} value={g.genre_id}>
                      {g.genre_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col ml-4">
                <h3>trạng thái</h3>
                <select
                  name="Status"
                  onChange={handleChange}
                  className="border my-1 p-1 pl-2 rounded-lg w-40"
                >
                  <option value="coming">Sắp chiếu</option>
                  <option value="showing">Đang chiếu</option>
                  <option value="ended">Đã kết thúc</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={() => setshowmodual(false)}
                className="w-30 bg-blue-300  mr-4 h-8 capitalize hover:bg-blue-500 rounded-lg "
              >
                hủy
              </button>
              <button
                onClick={Insertmovies}
                className="w-30 bg-blue-500 ml-4 h-8 capitalize hover:bg-blue-700 rounded-lg"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
      {showupdate && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="w-[400px] bg-white text-black rounded-lg p-6">
            <h2 className="flex justify-center font-bold uppercase ">
              Sửa thông tin phim
            </h2>
            <h3 className="capitalize">Tên phim:</h3>
            <input
              name="Title"
              value={form.Title}
              onChange={handleChange}
              type="text"
              placeholder="Tên phòng"
              className="border my-1 p-1 pl-2 rounded-lg w-full"
            />

            <div className="flex">
              <div className="flex flex-col mr-4">
                <h3>Thời lượng (Phút)</h3>
                <input
                  value={form.Duration}
                  onChange={handleChange}
                  name="Duration"
                  type="text"
                  className="border my-1 p-1 pl-2 rounded-lg w-40 "
                />
              </div>
              <div className="flex flex-col ml-4">
                <h3>Ngày phát hành</h3>
                <input
                  name="Release_date"
                  value={form.Release_date}
                  onChange={handleChange}
                  type="date"
                  className="border my-1 p-1 pl-2 rounded-lg w-40 "
                />
              </div>
            </div>
            <div className="flex">
              <div className="flex">
                <div className=" flex flex-col mr-4">
                  <h3>đường dẫn ảnh poster</h3>
                  <input
                    onChange={handleFileChange}
                    type="file"
                    className="border my-1 p-1 pl-2 rounded-lg w-40 "
                  />
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="flex flex-col mr-4">
                <h3>mã thể loại</h3>
                <select
                  multiple
                  name="Genre_ids"
                  value={form.Genre_ids}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value,
                    );
                    setForm({
                      ...form,
                      Genre_ids: selected,
                    });
                  }}
                  className="border my-1 p-1 pl-2 rounded-lg w-40 h-24"
                >
                  {genres.map((g) => (
                    <option key={g.genre_id} value={g.genre_id}>
                      {g.genre_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col ml-4">
                <h3>trạng thái</h3>
                <select
                  value={form.Status}
                  onChange={handleChange}
                  name="Status"
                  className="border my-1 p-1 pl-2 rounded-lg w-40"
                >
                  <option value="coming">Sắp chiếu</option>
                  <option value="showing">Đang chiếu</option>
                  <option value="ended">Đã kết thúc</option>
                </select>
              </div>
            </div>
            <div className="flex justify-center ">
              <button
                onClick={() => setupdate(false)}
                className="bg-blue-400 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
              >
                Hủy
              </button>
              <button
                onClick={updatemovie}
                className="bg-blue-500 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
              >
                Sửa
              </button>
            </div>
          </div>
        </div>
      )}
      {showmodchitiet && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[1000px] max-h-[500px] overflow-y-auto p-4">
            <h2 className="text-xl font-bold text-center mb-4 text-black capitalize">
              Chi tiết phim
            </h2>
            <table className="w-full text-left border border-collapse">
              <thead className="bg-gray-100 uppercase text-sm text-black">
                <tr>
                  <th className="p-3">ID chi tiết phim</th>
                  <th className="p-3">ID phim</th>
                  <th className="p-3">Mô tả</th>
                  <th className="p-3">Link trailer</th>
                  <th className="p-3">Quốc gia</th>
                  <th className="p-3">Đạo diễn</th>
                  <th className="p-3">Danh sách diễn viên</th>
                  <th className="p-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="text-black">
                {moviedetails.map((md) => (
                  <tr key={md.movie_detail_id}>
                    <td className="p-3">{md.movie_detail_id}</td>
                    <td className="p-3">{md.movie_id}</td>
                    <td className="p-3">{md.description}</td>
                    <td className="p-3">{md.trailer_url}</td>
                    <td className="p-3">{md.country}</td>
                    <td className="p-3">{md.director}</td>
                    <td className="p-3">{md.actors}</td>
                    <td className="p-3 text-center space-x-2 flex">
                      <button
                        onClick={() => handleEditDetail(md)}
                        className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() =>
                          deletedetailmovie(md.movie_detail_id, md.movie_id)
                        }
                        className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex capitalize justify-center mt-5">
              <button
                onClick={() => setshowmodualchitiet(true)}
                className="w-19 bg-blue-400 p-1 cursor-pointer rounded-lg mr-5 hover:bg-blue-500 "
              >
                Thêm
              </button>
              <button
                onClick={() => setshowmodchitiet(false)}
                className="w-19 bg-green-500 p-1 cursor-pointer rounded-lg capitalize ml-5 hover:bg-green-600 "
              >
                đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {showmodualchitiet && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="w-[600px] bg-white text-black rounded-lg p-6">
            <h2 className="capitalize mb-5 flex justify-center font-bold text-xl">
              Thêm Thông tin chi tiết phim
            </h2>
            <div className="flex flex-col mt-2">
              <h3 className="capitalize ml-2 pt-1">ID phim</h3>
              <input
                name="Movie_id"
                value={detailForm.Movie_id}
                onChange={handleDetailChange}
                className="border my-1 p-1 pl-2 rounded-lg "
                type="number"
                placeholder="Nhập ID phim"
              />
              <h3 className="capitalize ml-2 pt-1">Mô tả nội dung phim</h3>
              <textarea
                name="Description"
                value={detailForm.Description}
                onChange={handleDetailChange}
                className="w-full border p-2 rounded"
                placeholder="Nhập thông tin mô tả"
              ></textarea>
              <h3 className="capitalize ml-2 pt-1">Link trailer phim</h3>
              <input
                name="Trailer_url"
                value={detailForm.Trailer_url}
                onChange={handleDetailChange}
                className="border my-1 p-1 pl-2 rounded-lg "
                type="text"
                placeholder="Nhập Link trailer phim"
              />
              <h3 className="capitalize ml-2 pt-1">Quốc gia sản xuất</h3>
              <input
                name="Country"
                value={detailForm.Country}
                onChange={handleDetailChange}
                className="border my-1 p-1 pl-2 rounded-lg "
                type="text"
                placeholder="Nhập Quốc gia sản xuất"
              />
              <h3 className="capitalize ml-2 pt-1">Đạo diễn</h3>
              <textarea
                name="Director"
                value={detailForm.Director}
                onChange={handleDetailChange}
                className="w-full border p-2 rounded"
                placeholder="Nhập thông tin Đạo diễn"
              ></textarea>

              <h3 className="capitalize ml-2 pt-1">Danh sách diễn viên</h3>
              <textarea
                name="Actors"
                value={detailForm.Actors}
                onChange={handleDetailChange}
                className="w-full border p-2 rounded"
                placeholder="Nhập thông tin diễn viên"
              ></textarea>
            </div>
            <div className="flex mt-5 justify-center">
              <button
                onClick={() => {
                  Insertmoviesdetails();
                }}
                className="p-1 bg-blue-400 text-white capitalize rounded-lg cursor-pointer mr-5 hover:bg-blue-600"
              >
                Thêm chi tiết phim
              </button>
              <button
                onClick={() => {
                  setshowmodualchitiet(false);
                }}
                className="px-3 bg-green-500 text-white capitalize rounded-lg cursor-pointer mr-5 hover:bg-green-700"
              >
                đóng
              </button>
            </div>
          </div>
        </div>
      )}
      {showupdatechitiet && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
          <div className="w-[600px] bg-white text-black rounded-lg p-6">
            <h2 className="capitalize mb-5 flex justify-center font-bold text-xl">
              sửa Thông tin chi tiết phim
            </h2>
            <div className="flex flex-col mt-2">
              <h3 className="capitalize ml-2 pt-1">ID phim</h3>
              <input
                name="Movie_id"
                value={detailForm.Movie_id}
                onChange={handleDetailChange}
                className="border my-1 p-1 pl-2 rounded-lg "
                type="number"
                placeholder="Nhập ID phim"
              />
              <h3 className="capitalize ml-2 pt-1">Mô tả nội dung phim</h3>
              <textarea
                name="Description"
                value={detailForm.Description}
                onChange={handleDetailChange}
                className="w-full border p-2 rounded"
                placeholder="Nhập thông tin mô tả"
              ></textarea>
              <h3 className="capitalize ml-2 pt-1">Link trailer phim</h3>
              <input
                name="Trailer_url"
                value={detailForm.Trailer_url}
                onChange={handleDetailChange}
                className="border my-1 p-1 pl-2 rounded-lg "
                type="text"
                placeholder="Nhập Link trailer phim"
              />
              <h3 className="capitalize ml-2 pt-1">Quốc gia sản xuất</h3>
              <input
                name="Country"
                value={detailForm.Country}
                onChange={handleDetailChange}
                className="border my-1 p-1 pl-2 rounded-lg "
                type="text"
                placeholder="Nhập Quốc gia sản xuất"
              />
              <h3 className="capitalize ml-2 pt-1">Đạo diễn</h3>
              <textarea
                name="Director"
                value={detailForm.Director}
                onChange={handleDetailChange}
                className="w-full border p-2 rounded"
                placeholder="Nhập thông tin Đạo diễn"
              ></textarea>

              <h3 className="capitalize ml-2 pt-1">Danh sách diễn viên</h3>
              <textarea
                name="Actors"
                value={detailForm.Actors}
                onChange={handleDetailChange}
                className="w-full border p-2 rounded"
                placeholder="Nhập thông tin diễn viên"
              ></textarea>
            </div>
            <div className="flex mt-5 justify-center">
              <button
                onClick={() => {
                  updatedetailsmovie();
                }}
                className="p-1 bg-yellow-400 text-white capitalize rounded-lg cursor-pointer mr-5 hover:bg-yellow-600"
              >
                sửa chi tiết phim
              </button>
              <button
                onClick={() => {
                  setupdatechitiet(false);
                }}
                className="px-3 bg-green-500 text-white capitalize rounded-lg cursor-pointer mr-5 hover:bg-green-700"
              >
                đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
