"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { dangkytk } from "@/services/dangky";

export default function Dangky() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const themtaikhoan = async () => {
    try {
      const data = await dangkytk({
        Username: username,
        Email: email,
        Password: password,
      });
      localStorage.setItem("token", data.token);
      alert("Đăng ký thành công");
      router.push("/home/login");
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Có lỗi xảy ra");
      }
    }
  };

  return (
    <div className="pt-10 pb-10">
      <div className="w-[400px] m-auto border text-black rounded-lg p-6 shadow-lg">
        <div className="flex justify-center mt-5 mb-5 bg-red-500 p-3 rounded-xl text-white">
          <h2 className="uppercase font-bold text-2xl">Đăng ký</h2>
        </div>

        <h3>Username:</h3>
        <input
          placeholder="Nhập tên đăng ký"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />

        <h3>Email:</h3>
        <input
          placeholder="Nhập email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />

        <h3>Password:</h3>
        <input
          placeholder="Nhập mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />

        <div className="flex justify-center">
          <Link href={"/home/login"}>
            <button className="mr-3 mt-3 px-3 bg-red-500 p-2 text-white rounded-xl">
              Đăng nhập
            </button>
          </Link>

          <button
            onClick={themtaikhoan}
            className="ml-3 mt-3 px-4 bg-red-500 p-2 text-white rounded-xl"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}
