export type User = {
  user_id: number;
  username: string;
  role_id: number;
};

export type LoginResponse = {
  token: string;
  user: User;
  message?: string;
};

const API = "http://localhost:3000/User";

export const loginService = async (
  username: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      Username: username,
      Password: password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.log("LOGIN ERROR:", data);
    throw new Error(data.message || "Đăng nhập thất bại");
  }

  return data;
};
