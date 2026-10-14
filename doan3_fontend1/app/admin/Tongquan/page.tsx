"use client";
import { useEffect, useState } from "react";

type MovieStats = {
  id: number;
  released: number;
  upcoming: number;
  total: number;
};

export default function Tongquan() {
  const [stats, setStats] = useState<MovieStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:3000/api/moviestats"); // URL backend
        if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu thống kê phim");
        const data: MovieStats = await res.json();
        setStats(data);
      } catch (err) {
        // Kiểm tra nếu err là Error object
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Lỗi không xác định");
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <p className="p-10 text-lg">Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p className="p-10 text-lg text-red-500">Lỗi: {error}</p>;
  }

  if (!stats) {
    return <p className="p-10 text-lg text-gray-500">Không có dữ liệu</p>;
  }

  return (
    <div className="p-10">
      <div className="grid grid-cols-3 gap-10">
        <div className="bg-green-500 rounded-lg p-3 shadow-sm">
          <p className="uppercase text-lg">Số lượng phim đã chiếu:</p>
          <h2 className="text-2xl font-bold">{stats.released}</h2>
        </div>
        <div className="bg-red-500  rounded-lg p-3 shadow-sm">
          <p className="uppercase text-lg">Số lượng phim chưa công chiếu :</p>
          <h2 className="text-2xl font-bold">{stats.upcoming}</h2>
        </div>
        <div className="bg-amber-500 rounded-lg p-3 shadow-sm">
          <p className="uppercase text-lg">Tổng số lượng phim:</p>
          <h2 className="text-2xl font-bold">{stats.total}</h2>
        </div>
      </div>
    </div>
  );
}
