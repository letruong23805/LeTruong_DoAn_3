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
export default function Tatcarap() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  useEffect(() => {
    getAllTheaters().then(setTheaters);
  });
  return (
    <div className="w-[700px] m-auto p-15 ">
      <div className="max-h-[580px] overflow-y-auto border rounded-lg">
        <table className="w-full text-left border border-collapse ">
          <thead className="bg-gray-100 uppercase text-sm text-black">
            <tr>
              <th className="p-3">tên rạp</th>
              <th className="p-3">địa chỉ</th>
              <th className="p-3">số điện thoại</th>
            </tr>
          </thead>
          <tbody className="text-black">
            {theaters.map((t) => (
              <tr key={t.theater_id} className="border-t hover:bg-gray-50">
                <td className="p-3">{t.name}</td>
                <td className="p-3">{t.address}</td>
                <td className="p-3">{t.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
