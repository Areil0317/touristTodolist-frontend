import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./LoginSystem.css";

const API_ASSETS = process.env.REACT_APP_ASSETS_URL;

function NavList() {
  return (
    <div className="navbar-nav ms-auto" id="NavList">
      <Link className=" text-dark " to="/register">
        <div className=" btn btn-light" style={{ marginRight: "10px" }}>
          註冊
        </div>
      </Link>
      <Link className=" text-dark" to="/login">
        <div className=" btn btn-light">登入</div>
      </Link>
    </div>
  );
}

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "#AAD9BB", height: "100px" }}
      >
        <div className="container-fluid">
          <div className="container-fluid d-flex flex-nowrap">
            <div className="navbar-brand" style={{ fontSize: "40px" }}>
              <img src="logo.svg" style={{ height: "80px" }}></img>
              清單樂旅
            </div>
            <button
              className="navbar-toggler "
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div>
              <NavList />
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              註冊
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">
              登入
            </Link>
          </li>
        </ul>
      </div>
      <h1 style={{ padding: "15px", textAlign: "center", fontWeight: "bold" }}>
        逐項完成，一個旅行TO-DO-LIST，一段美好旅程！
      </h1>
      <h4
        className="responsive-hide"
        style={{
          padding: "0px 150px",
          textAlign: "center",
          color: "gray",
        }}
      >
        透過我們的旅行TO-DO-LIST網站，將你的夢想一步步地轉化為現實。計劃你的下一個冒險，記錄下你想要體驗的一切，然後，讓我們幫助你實現它們。開始你的旅程，盡情探索世界，收集美好回憶！
      </h4>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          className="desktop-img"
          src="\UserListSource\homepage.png"
          style={{
            margin: "25px",
            width: "40%",
            height: "470px",
          }}
        ></img>
        <img
          className="desktop-img"
          src="\UserListSource\sample.png"
          alt="Sample"
          style={{
            margin: "25px",
            width: "54%",
            height: "480px",
          }}
        />

        <img
          className="mobile-img"
          src="\UserListSource\homepage2.png"
          alt="Mobile version"
          style={{
            width: "100%",
            height: "450px",
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
