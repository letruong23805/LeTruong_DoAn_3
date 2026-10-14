"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginService } from "@/services/login";

export default function Dangnhap() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const login = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const data = await loginService(username, password);

      localStorage.setItem("token", data.token);

      alert("Đăng nhập thành công");

      if (data.user.role_id === 1) {
        router.push("/admin/Tongquan");
      } else {
        router.push("/home/trangchu");
      }
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-10 pb-10">
      <div className="w-[400px] m-auto border text-black rounded-lg p-6 shadow-lg">
        <div className="flex justify-center mt-5 mb-5 bg-red-500 p-3 rounded-xl text-white">
          <h2 className="uppercase font-bold text-2xl">Đăng nhập</h2>
        </div>

        <h3 className="mb-1">username:</h3>
        <input
          placeholder="Nhập tên tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3"
        />

        <h3 className="mb-1">password:</h3>
        <input
          placeholder="Nhập mật khẩu tài khoản"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded-lg mb-3"
        />

        <div className="flex justify-center">
          <button
            onClick={login}
            disabled={loading}
            className="mr-3 mt-3 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <Link href="/home/dangky">
            <button className="ml-3 mt-3 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600">
              Đăng ký
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
