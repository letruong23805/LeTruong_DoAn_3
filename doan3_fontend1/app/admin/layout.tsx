"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
// import { jwtDecode } from "jwt-decode";

type UserToken = {
  user_id: number;
  role_id: number;
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");

  //     if (!token) {
  //       router.push("/home/login");
  //       return;
  //     }

  //     try {
  //       const user = jwtDecode<UserToken>(token);

  //       if (user.role_id !== 1) {
  //         router.push("/home/trangchu");
  //       }
  //     } catch (err) {
  //       localStorage.removeItem("token");
  //       router.push("/home/login");
  //     }
  //   }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Đăng xuất thành công");
    router.push("/home/login");
  };
  return (
    <div className="flex font-['Times_New_Roman']">
      <div className="w-64 bg-black h-100vh border-r">
        <h1 className="h-15 flex justify-center items-center text-5xl"> CGV</h1>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Tongquan"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            tổng quan
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Movies"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý phim
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Genres"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý Thể loại phim
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Theaters"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý Rạp chiếu
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Rooms"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý phòng chiếu phim
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Showtimes"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý Suất chiếu
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Seats"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý ghế ngồi
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Bookings"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý Đặt vé
          </Link>
        </li>
        <li className="  border-b-1 h-14">
          <Link
            href="/admin/Users"
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-white hover:text-black"
          >
            Quản lý Người dùng
          </Link>
        </li>
        <li className="border-b-1 h-14">
          <button
            onClick={handleLogout}
            className="w-full h-full flex items-center pl-5 capitalize text-lg hover:bg-red-400 hover:text-white"
          >
            Đăng xuất
          </button>
        </li>
      </div>
      <div className="flex-1">
        <div className="h-14 bg-black flex justify-end items-center gap-6 pr-10 text-lg">
          <span>Admin</span>
          <Link rel="stylesheet" href="/home/trangchu" className="uppercase">
            Trang HOME
          </Link>
        </div>
        <div className="bg-white min-h-screen">{children}</div>
      </div>
    </div>
  );
}
