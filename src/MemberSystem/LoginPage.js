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
      localStorage.setItem("userToken", data.token);
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
          <img
            src="\UserListSource\login.png"
            style={{
              height: "500px",
            }}
          ></img>
        </div>
        <div className="login-system">
          <div className="col-11 col-md-10">
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
                <Link to="/register"> 還沒有帳號？註冊會員 </Link>|
                <Link to="/forgotpassword"> 忘記密碼 </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
