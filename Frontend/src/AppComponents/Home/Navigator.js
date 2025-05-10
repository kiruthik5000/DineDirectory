import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login_page from "../login/Login_page";
import Home from "./Home";
import Sign_page from "../Signin/Sign_page";
import Rest2 from "../Restaurant/Rest2";
import Hotel from "../Single_Cards/Hotel";
import Profile from "../Profile/Profile";

const Navigator = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/login" element={<Login_page/>}></Route>
          <Route path="/signup" element={<Sign_page/>}></Route>
          <Route path="/list/:type" element={<Rest2/>}></Route>
          <Route path= "/hotel/:id" element={<Hotel/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Navigator;
