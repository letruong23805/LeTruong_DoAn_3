"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MovieDetailchitiet, getidmovie } from "@/services/moviedetails";
import { useRouter } from "next/navigation";

// type Movies = {
//   movie_id: number;
//   title: string;
//   description: string;
//   duration: number;
//   release_date: string;
//   country: string;
//   director: string;
//   actors: string;
//   poster: string;
//   trailer_url: string;
//   genres: string;
//   genre_ids: string;
//   status: string;
//   created_at: string;
// };
// type Genres = {
//   genre_id: number;
//   genre_name: string;
// };

export default function Ctphim() {
  const { id } = useParams();
  const [chitietp, setchitietp] = useState<MovieDetailchitiet | null>(null);

  const router = useRouter();

  const datve = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn cần đăng nhập!");
      router.push("/home/login");
      return;
    } else {
      router.push("/home/datve");
    }
  };

  useEffect(() => {
    if (!id) return;
    const reload = async () => {
      const data = await getidmovie(id as string);
      setchitietp(data);
    };
    reload();
  }, [id]);

  //   useEffect(() => {
  //     fetch("http://localhost:3000/genres/all")
  //       .then((res) => res.json())
  //       .then((data) => setGenres(data))
  //       .catch((err) => console.log(err));
  //   }, []);
  //   const genreMap: Record<number, string> = Object.fromEntries(
  //     genres.map((g) => [g.genre_id, g.genre_name]),
  //   );
  return (
    <div className="w-[1000px] m-auto pt-10 pb-10 text-black    ">
      <div className="uppercase text-xl">
        <h2>Nội dung phim</h2>
        <hr />
      </div>
      {chitietp && (
        <>
          <div className="flex mt-5 ">
            <div className="w-[200px] h-[270px] border">
              <img
                src={`http://localhost:3000${chitietp.poster}`}
                alt="ảnh bị lỗi"
                className="w-full h-full"
              />
            </div>
            <div className="ml-5 w-[800px] leading-loose ">
              <h3 className="text-2xl font-bold uppercase mb-5 ">
                {chitietp.title}
              </h3>
              <div className="flex">
                <p className="pr-5 capitalize font-bold">Đạo diễn:</p>
                <p className="capitalize">{chitietp.director}</p>
              </div>
              <div className="flex">
                <p className="pr-5 capitalize font-bold">diễn viên:</p>
                <p className="capitalize">{chitietp.actors}</p>
              </div>
              <div className="flex">
                <p className="pr-5 capitalize font-bold">Thể loại:</p>
                <div>
                  {chitietp.genres?.split(",").map((g: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-600 px-2 py-1 mr-2 rounded text-sm"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex">
                <p className="pr-5 capitalize font-bold">Khởi chiếu:</p>
                <p className="capitalize">
                  {" "}
                  {new Date(chitietp.release_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex">
                <p className="pr-5 capitalize font-bold">thời lượng:</p>
                <p className="capitalize">{chitietp.duration} phút</p>
              </div>
              <div className="flex">
                <p className="pr-5 capitalize font-bold">Quốc gia:</p>
                <p className="capitalize">{chitietp.country}</p>
              </div>

              <div className="w-20 h-7 bg-red-500 flex items-center justify-center rounded-lg">
                <button onClick={datve} className="text-white cursor-pointer">
                  Đặt vé
                </button>
              </div>
            </div>
          </div>
          <p className="pt-10">{chitietp.description}</p>
        </>
      )}
    </div>
  );
}
