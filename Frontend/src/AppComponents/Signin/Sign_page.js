import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import EmailIcon from "@mui/icons-material/Email";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import "./Sign_page.css";

const SignPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};
    if (form.username.length < 3) newErrors.username = "Username must be at least 3 characters.";
    if (!regex.test(form.email)) newErrors.email = "Enter a valid email address.";
    if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const response = await axios.post("http://localhost:5000/api/users/adduser", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      alert(response.data.message || "Signed up successfully!");
      console.log(form);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Signup failed!");
    }
  };

  return (
      <div className="blur">
        <div className="box">
          <center>
            <h2 className="title">Sign Up</h2>
            <p className="subtitle">Create your account</p>
          </center>
          <form >
            <div className="form-field">
              <Avatar className="avatar" />
              <TextField
                  label="Username"
                  variant="standard"
                  name="username"
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  fullWidth
              />
            </div>
            <div className="form-field">
              <EmailIcon />
              <TextField
                  label="Email"
                  variant="standard"
                  name="email"
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
              />
            </div>
            <div className="form-field">
              <KeyRoundedIcon />
              <TextField
                  label="Password"
                  type="password"
                  variant="standard"
                  name="password"
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
              />
            </div>
            <div className="form-field">
              <KeyRoundedIcon />
              <TextField
                  label="Confirm Password"
                  type="password"
                  variant="standard"
                  name="confirmPassword"
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  fullWidth
              />
            </div>
            <center>
              <Button
                  onClick={handleSubmit}
                  variant="contained"
                  className="submit-button"
              >
                Sign Up
              </Button>
              <p>Or</p>
              <Button startIcon={<GoogleIcon />} className="social-button">Sign in with Google</Button>
              <Button startIcon={<GitHubIcon />} className="social-button">Sign in with GitHub</Button>
              <Button startIcon={<FacebookIcon />} className="social-button">Sign in with Facebook</Button>
            </center>
          </form>
        </div>
      </div>
  );
};

export default SignPage;
