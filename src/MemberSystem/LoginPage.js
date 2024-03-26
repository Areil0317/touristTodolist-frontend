import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "./LoginSystem.css";

const API_HOST = process.env.REACT_APP_API_URL;

function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(API_HOST + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Success");
      // 登錄成功後的處理，例如保存 token，導航到另一頁等
      // 保存 token 到 localStorage 或 sessionStorage
      localStorage.setItem("userToken", data.token);
      // 根據需要導航，例如導航到首頁
      navigate("/alist", { state: { email: data.user.email } });
    } catch (error) {
      console.error("Failed to login:", error);
      alert("帳號或密碼錯誤");
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#AAD9BB", height: "100px" }}
      >
        <div className="container-fluid">
          <img src="logo.svg" style={{ height: "80px" }}></img>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div
              className="navbar-brand text-dark"
              style={{ fontSize: "32px" }}
            >
              清單樂旅
            </div>
          </Link>
          <span className="ms-auto"></span>
        </div>
      </nav>
      <div
        className="mt-5"
        style={{
          display: "flex",
        }}
      >
        <div
          style={{
            width: "48%",
            margin: "50px",
          }}
          className="desktop-img"
        >
          <img src="https://media.discordapp.net/attachments/1134860695343738910/1219168723005472778/ariel_wu_A_woman_is_walking_on_the_street_minimalist_simple_sof_4103bebb-e539-4c75-9f76-920bcb4da5f8.png?ex=660a525a&is=65f7dd5a&hm=0492a8d1a5c9111e1e94b5c58efb802b42ef755de2f43af7a1ac3e0414054feb&=&format=webp&quality=lossless&width=929&height=619"></img>
        </div>
        <div className="login-system">
          <div className="col-12 col-md-10">
            <h2>登入</h2>
            <br></br>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    電子信箱
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    密碼
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                  />
                </div>
                <br></br>
                <button
                  type="submit"
                  className="btn"
                  style={{ width: "100%", backgroundColor: "#AAD9BB" }}
                >
                  登入
                </button>
              </form>
              <br></br>
              <div>
                <Link to="/register"> 還沒有帳號？註冊會員 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
