"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { timkiemtrangchu } from "@/services/movies";
import { useEffect, useState } from "react";
type Movie = {
  movie_id: number;
  title: string;
  poster: string;
};
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    const timkiemm = async () => {
      if (keyword.trim() === "") {
        setMovies([]);
        return;
      }
      try {
        const data = await timkiemtrangchu(keyword);
        setMovies(data.slice(0, 3));
      } catch (error) {
        console.log(error);
      }
    };
    const timeout = setTimeout(() => {
      timkiemm();
    }, 300);
    return () => clearTimeout(timeout);
  }, [keyword]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Đăng xuất thành công");
    router.push("/home/login");
  };
  const handleDatVe = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Vui lòng đăng nhập trước khi đặt vé");
      router.push("/home/login");
      return;
    }

    router.push("/home/datve");
  };
  return (
    <div>
      <div className="bg-amber-400 ">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap justify-center px-2 text-xs uppercase sm:justify-end sm:text-sm">
          <Link href="/home" className="cursor-pointer p-2 sm:pr-5">
            tin mới & ưu đãi
          </Link>
          <Link href="/home/vecuatoi" className="cursor-pointer p-2 sm:pr-5">
            Vé của tôi
          </Link>
          <Link href="/home/login" className="cursor-pointer p-2">
            đăng nhập
          </Link>
          <Link href="/home/dangky" className="cursor-pointer p-2">
            /đăng ký
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer p-2 uppercase"
          >
            đăng xuất
          </button>
        </div>
      </div>
      <div className="bg-amber-100">
        <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center justify-center gap-2 p-2 lg:flex-nowrap lg:justify-between">
          <div>
            <Link href="/home/trangchu">
              <img src="/img/cgvlogo.png" alt="logo" />
            </Link>
          </div>
          <div className="z-50 flex flex-wrap justify-center p-2 text-xs uppercase text-black sm:p-4 sm:text-sm lg:p-6">
            <div className="relative group">
              <Link href="/home" className="px-2 sm:px-6">
                Phim
              </Link>
              <div className="absolute hidden group-hover:flex bg-white w-55 h-auto flex-col top-5 rounded-lg">
                <Link
                  href="/home/phim"
                  className="p-3  border-b-2 border-gray-300 hover:bg-amber-300 hover:rounded-lg"
                >
                  Phim đang chiếu
                </Link>
                <Link
                  href="/home/Phimsapchieu"
                  className="p-3 hover:bg-amber-300 hover:rounded-lg"
                >
                  Phim sắp chiếu
                </Link>
              </div>
            </div>
            <div className="relative group">
              <Link href="/home" className="px-2 sm:px-6">
                rạp CGV
              </Link>
              <div className="absolute hidden group-hover:flex flex-col w-55 bg-white h-auto rounded-lg  ">
                <Link
                  href="/home/tatcacacrap"
                  className="p-3 border-b-2 border-gray-300 hover:bg-amber-300 hover:rounded-lg "
                >
                  tất cả các rạp CGV
                </Link>
                <Link
                  href="/home"
                  className="p-3 border-gray-300 border-b-2 hover:bg-amber-300 hover:rounded-lg "
                >
                  rạp đặc biệt
                </Link>
                <Link
                  href="/home"
                  className="p-3 hover:bg-amber-300 hover:rounded-lg"
                >
                  rạp 3d
                </Link>
              </div>
            </div>
            <div className="relative group">
              <Link href="/home" className="px-2 sm:px-6">
                Thành viên
              </Link>
              <div className="absolute hidden group-hover:flex flex-col w-48 h-auto bg-white rounded-lg">
                <Link
                  href="/home"
                  className="p-3 border-b-2 border-gray-300 hover:bg-amber-300 hover:rounded-lg"
                >
                  tài khoản cgv
                </Link>
                <Link
                  href="/home"
                  className="p-3 border-gray-300 hover:bg-amber-300 hover:rounded-lg"
                >
                  quyền lợi
                </Link>
              </div>
            </div>
            <div className="relative group">
              <Link href="/home" className="px-2 sm:px-6">
                cultureplex
              </Link>
              <div className="absolute hidden group-hover:flex flex-col w-60 h-auto bg-white rounded-lg">
                <Link
                  href="/home"
                  className="p-3 border-b-2 border-gray-300 hover:bg-amber-300 hover:rounded-lg"
                >
                  Quầy online
                </Link>
                <Link
                  href="/home"
                  className="p-3 border-b-2 border-gray-300 hover:bg-amber-300 hover:rounded-lg"
                >
                  Thuê rạp & vé nhóm
                </Link>
                <Link
                  href="/home"
                  className="p-3 border-b-2 border-gray-300 hover:bg-amber-300 hover:rounded-lg "
                >
                  cgv egift
                </Link>
                <Link
                  href="/home"
                  className="p-3  hover:bg-amber-300 hover:rounded-lg"
                >
                  cgv rules
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden min-w-0 flex-1 items-center justify-center text-black sm:flex">
            <div className="relative w-full max-w-[300px]">
              <input
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setShowResult(true);
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowResult(false);
                  }, 200);
                }}
                type="text"
                placeholder="Tìm kiếm..."
                className="relative w-full rounded-lg border border-black bg-white p-1 pl-2 pr-9 font-['Times_New_Roman'] text-mg outline-none"
              />
              <FaSearch className="absolute right-[10px] top-1.5 text-gray-500 cursor-pointer  " />
              {showResult && movies.length > 0 && (
                <div className="absolute top-[40px] left-0  w-[300px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-[250px] overflow-y-auto z-50">
                  {movies.map((movie) => (
                    <Link
                      key={movie.movie_id}
                      href={`/home/chitietphim/${movie.movie_id}`}
                      className="flex items-center gap-3 p-3 hover:bg-amber-100 border-b"
                    >
                      <img
                        src={`http://localhost:3000${movie.poster}`}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded"
                      />

                      <p className="text-black text-sm">{movie.title}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <img
              src="/img/mua-ve_ngay.png"
              alt=""
              className="ml-2 w-28 max-w-full cursor-pointer sm:ml-8 sm:w-36 lg:ml-16 lg:w-auto"
              onClick={handleDatVe}
            />
          </div>
        </div>
      </div>
      <div className="  bg-white">{children}</div>

      <div className="bg-amber-300 ">
        <div className="mx-auto min-h-[700px] w-full max-w-[1000px] px-4 py-8">
          <div className="grid grid-cols-2 gap-6 text-sm text-black md:grid-cols-4 md:gap-4">
            <div className="capitalize ">
              <h3>CGV Việt Nam</h3>
              <p>Giới thiệu</p>
              <p>Tiện ịch online</p>
              <p>thẻ quà tặng</p>
              <p>tuyển dụng</p>
              <p>Liện hệ quảng cáo cgv</p>
              <p>dành cho đối tác</p>
            </div>
            <div className="capitalize">
              <h3>Điều khoản sửa dụng</h3>
              <p>Điều khoản chung</p>
              <p>Điều khoản giao dịch</p>
              <p>chính sách thanh toán</p>
              <p>chính sách bảo mật</p>
              <p>những quy định tại rạp phim</p>
              <p>câu hỏi thường gặp</p>
            </div>
            <div className="capitalize">
              <h3>kết nối với chúng tôi</h3>
              <p>Giới thiệu</p>
              <p>Tiện ịch online</p>
              <p>thẻ quà tặng</p>
              <p>tuyển dụng</p>
              <p>Liện hệ quảng cáo cgv</p>
              <p>dành cho đối tác</p>
            </div>
            <div className="capitalize">
              <h3>chăm sóc khách hàng</h3>
              <p>Hotline: 1900 6017</p>
              <p>
                Giờ làm việc: 8:00 - 22:00 (Tất cả các ngày bao gồm cả Lễ Tết)
              </p>
              <p>Email hỗ trợ: hoidap@cgv.vn</p>
            </div>
          </div>
          <div className="flex justify-center p-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d7452.648104605971!2d106.06000171447481!3d20.939497779660833!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1781515380994!5m2!1svi!2s"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: 10 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
