"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import {
  Users,
  getAllUsers,
  searchUsersByName,
  insertUser,
  updateUser,
  deleteUser,
} from "@/services/users";

export default function QLNguoiDung() {
  // ============ STATE: Modal flags ============
  const [showmodual, setshowmodual] = useState(false);
  const [showupdate, setupdate] = useState(false);

  // ============ STATE: Users ============
  const [users, setusers] = useState<Users[]>([]);
  const [keyword, setkeyword] = useState("");

  // ============ STATE: Insert form ============
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ============ STATE: Update form ============
  // Đổi tên thành editUser để tránh trùng với hàm updateUser import
  const [editUser, setEditUser] = useState<Users | null>(null);

  // ============ EFFECTS ============
  useEffect(() => {
    getAllUsers().then((data) => setusers(data));
  }, []);

  // ============ HANDLERS ============
  const reload = async () => {
    const data = await getAllUsers();
    setusers(data);
  };

  const searchusers = async () => {
    try {
      if (!keyword.trim()) {
        const data = await getAllUsers();
        setusers(data);
        return;
      }
      const data = await searchUsersByName(keyword);
      setusers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const Insertusers = async () => {
    try {
      if (!username || !email || !password) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
      }
      const data = await insertUser({
        Username: username,
        Email: email,
        Password: password,
      });
      console.log(data.message);
      const newdata = await getAllUsers();
      setusers(newdata);
      setshowmodual(false);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      alert("Thêm thất bại");
    }
  };

  const Updateusers = async () => {
    if (!editUser) return;
    try {
      const data = await updateUser(editUser.user_id, {
        Role_id: editUser.role_id,
        Username: editUser.username,
        Email: editUser.email,
        Password: editUser.password,
        Status: editUser.status,
      });
      alert(data.message);
      const newdata = await getAllUsers();
      setusers(newdata);
      setupdate(false);
      setEditUser(null);
    } catch (error) {
      console.error(error);
      alert("Cập nhật thất bại");
    }
  };

  const deleteUsers = async (id: number) => {
    const confirm_ = confirm("Bạn có chắc chắn muốn xóa ko");
    if (!confirm_) return;
    try {
      const data = await deleteUser(id);
      alert(data.message);
      const newdata = await getAllUsers();
      setusers(newdata);
    } catch (error) {
      console.error(error);
      alert("Xóa thất bại");
    }
  };

  // ============ RENDER ============
  return (
    <div className="ml-10 p-10">
      <div className="h-10 w-60 bg-amber-400 mb-6 flex justify-center items-center text-xl capitalize rounded">
        Quản lý người dùng
      </div>

      <div className="flex mb-10">
        <div className="flex">
          <input
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
            type="text"
            placeholder="Tìm kiếm tài khoản theo tên"
            className="w-[400px] pl-5 h-8 mr-15 rounded outline-none border-b border-gray-400 focus:border-b-2 focus:border-blue-600 placeholder:text-gray-600 text-black"
          />
          <button
            onClick={searchusers}
            className="bg-blue-600 hover:bg-blue-700 w-25 h-8 rounded cursor-pointer"
          >
            Tìm kiếm
          </button>
          <RefreshCw
            onClick={reload}
            className="ml-12 bg-blue-600 w-20 h-8 rounded-lg cursor-pointer"
          />
        </div>
        <div className="flex ml-60">
          <button
            onClick={() => setshowmodual(true)}
            className="capitalize h-8 w-50 bg-blue-500 rounded cursor-pointer hover:bg-blue-700"
          >
            + Thêm người dùng
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border border-collapse">
            <thead className="bg-gray-100 uppercase text-sm text-black">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Mã quyền</th>
                <th className="p-3">Tên đăng nhập</th>
                <th className="p-3">Email</th>
                <th className="p-3">Mật khẩu</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-black">
              {users.map((u) => (
                <tr key={u.user_id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{u.user_id}</td>
                  <td className="p-3">{u.role_id}</td>
                  <td className="p-3">{u.username}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 max-w-[150px] truncate">{u.password}</td>
                  <td className="p-3">{u.status}</td>
                  <td className="p-3">{u.created_at}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        setupdate(true);
                        setEditUser(u);
                      }}
                      className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => deleteUsers(u.user_id)}
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

        {/* Modal Thêm người dùng */}
        {showmodual && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-[400px] text-black">
              <h2 className="text-xl flex justify-center font-semibold mb-4">
                Thêm người dùng
              </h2>
              <h3 className="capitalize">Tên đăng nhập</h3>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Nhập tên đăng nhập"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3 className="capitalize">Email</h3>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Nhập email"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Mật khẩu</h3>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="text"
                placeholder="Mật khẩu"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <div className="flex justify-center">
                <button
                  onClick={() => setshowmodual(false)}
                  className="w-30 bg-blue-300 m-4 h-8 capitalize hover:bg-blue-500 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={Insertusers}
                  className="w-30 bg-blue-500 m-4 h-8 capitalize hover:bg-blue-700 rounded-lg"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Sửa người dùng */}
        {showupdate && (
          <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
            <div className="w-[400px] bg-white text-black rounded-lg p-6">
              <h2 className="flex justify-center font-bold uppercase">
                Sửa người dùng
              </h2>
              <h3 className="capitalize">Mã quyền</h3>
              <input
                value={editUser?.role_id}
                onChange={(e) =>
                  setEditUser({ ...editUser!, role_id: Number(e.target.value) })
                }
                className="pl-3 border rounded-lg w-full py-1"
                type="text"
                placeholder="Nhập mã quyền"
              />
              <h3 className="capitalize">Tên đăng nhập</h3>
              <input
                value={editUser?.username}
                onChange={(e) =>
                  setEditUser({ ...editUser!, username: e.target.value })
                }
                className="pl-3 border rounded-lg w-full py-1"
                type="text"
                placeholder="Nhập tên đăng nhập"
              />
              <h3 className="capitalize">Email</h3>
              <input
                value={editUser?.email}
                onChange={(e) =>
                  setEditUser({ ...editUser!, email: e.target.value })
                }
                type="email"
                placeholder="Nhập email"
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Mật khẩu</h3>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                onChange={(e) =>
                  setEditUser({ ...editUser!, password: e.target.value })
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              />
              <h3>Trạng thái</h3>
              <select
                value={editUser?.status}
                onChange={(e) =>
                  setEditUser({
                    ...editUser!,
                    status: e.target.value as "active" | "inactive",
                  })
                }
                className="border my-1 p-1 pl-2 rounded-lg w-full"
              >
                <option value="">Chọn trạng thái</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <div className="flex justify-center">
                <button
                  onClick={() => setupdate(false)}
                  className="bg-blue-400 w-20 h-10 m-5 rounded-xl text-white hover:bg-blue-700"
                >
                  Hủy
                </button>
                <button
                  onClick={Updateusers}
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
