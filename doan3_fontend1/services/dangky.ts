const BASE_URL = "http://localhost:3000";
export type RegisterForm = {
  Username: string;
  Email: string;
  Password: string;
};

export const dangkytk = async (form: RegisterForm) => {
  const res = await fetch(`${BASE_URL}/User/insert`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Đăng ký thất bại");
  }
  return data;
};
