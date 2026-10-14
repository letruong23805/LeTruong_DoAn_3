"use client";
import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import {
  Movies,
  MovieForm,
  Genres,
  getAllMovies,
  getAllGenres,
  searchMoviesByName,
  insertMovie,
  updateMovie,
  deleteMovie,
} from "@/services/movies";
export default function Trangchu() {
  const banners = [
    "/img/banler.jpg",
    "/img/banner2.jpg",
    "/img/banner3.jpg",
    "/img/banner4.jpg",
    "/img/banner5.png",
  ];
  const [currentBanner, setCurrentBanner] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);
  const [hienthi, sethienthi] = useState<Movies[]>([]);
  const [genres, setGenres] = useState<Genres[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // tính index
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  // dữ liệu hiện tại
  const currentMovies = hienthi.slice(indexOfFirst, indexOfLast);

  // tổng số trang
  const totalPages = Math.ceil(hienthi.length / itemsPerPage);

  useEffect(() => {
    getAllMovies().then(sethienthi);
  }, []);
  useEffect(() => {
    getAllGenres().then(setGenres);
  }, []);

  return (
    <div className="pt-10 pb-10">
      <div className="w-[1000px] m-auto">
        <div className="relative w-[1000px] h-[400px] overflow-hidden rounded-xl">
          <img
            src={banners[currentBanner]}
            alt="banner"
            className="w-full h-full object-cover duration-700 transition-all"
          />

          {/* Nút trái */}
          <button
            onClick={() =>
              setCurrentBanner(
                currentBanner === 0 ? banners.length - 1 : currentBanner - 1,
              )
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
          >
            ❮
          </button>

          {/* Nút phải */}
          <button
            onClick={() =>
              setCurrentBanner(
                currentBanner === banners.length - 1 ? 0 : currentBanner + 1,
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
          >
            ❯
          </button>

          {/* Dấu chấm */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {banners.map((_, index) => (
              <div
                key={index}
                onClick={() => setCurrentBanner(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentBanner === index ? "bg-white" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex items-center mt-10">
          <hr className="flex-1 border-3 border-gray-300" />
          <p className=" px-4 font-bold uppercase text-black text-3xl">
            movie selection
          </p>

          <hr className="flex-1 border-3 border-gray-300" />
        </div>

        <div className="grid grid-cols-4 gap-4 mt-10 ">
          {currentMovies.map((ht) => (
            <div
              key={ht.movie_id}
              className="w-[200px] h-[420px] border overflow-hidden "
            >
              <div>
                <img
                  src={
                    ht.poster
                      ? `http://localhost:3000${ht.poster}`
                      : "/img/default.jpg"
                  }
                  alt={ht.title}
                  className="w-full h-[230px]"
                />
              </div>
              <div className="w-full h-[190px] text-black overflow-y-auto">
                <h3 className="uppercase flex justify-center mt-2 font-bold">
                  {ht.title}
                </h3>
                <div className="flex flex-wrap">
                  <p className="whitespace-nowrap font-bold mr-1 ml-1">
                    Thể loại:
                  </p>
                  <div>
                    {ht.genres?.split(",").map((g: string, i: number) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-600 px-2 py-1 mr-1 rounded text-sm"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex">
                  <p className="whitespace-nowrap font-bold mr-1 ml-1">
                    Thời lượng:
                  </p>
                  <p>{ht.duration} phút</p>
                </div>
                <div className="flex">
                  <p className="whitespace-nowrap font-bold mr-1 ml-1">
                    khởi chiếu:
                  </p>
                  <p>{new Date(ht.release_date).toLocaleDateString()}</p>
                </div>
                <div className="w-full flex justify-center">
                  <Link href={`/home/chitietphim/${ht.movie_id}`}>
                    <button className=" w-16 h-8 mt-1 bg-red-500 rounded-lg text-white cursor-pointer ">
                      Chi tiết
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-6 space-x-2">
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 gap-2">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ←
              </button>

              {/* Danh sách trang */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 2,
                )
                .map((page, index, array) => (
                  <Fragment key={page}>
                    {index > 0 && page - array[index - 1] > 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}

                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg font-medium transition-all duration-200 ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-white border text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                      }`}
                    >
                      {page}
                    </button>
                  </Fragment>
                ))}

              {/* Next */}
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded-lg border bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
