import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import "./login_page.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import axios from "axios";
const Login_page = () => {
  localStorage.setItem("user", null);
  const navigate = useNavigate();
  const [showPassword, setshowPassword] = useState(false);
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  const handleClickShowPassword = () => {
	setshowPassword(!showPassword)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!details.email || !details.password) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/login?email=${details.email}&password=${details.password}`
      );
      console.log(response.data);
      if (response.status == 200) {
        localStorage.setItem("user", response.data.user.username);
        navigate(`/`);
      }
      alert(response.data.message);
    } catch (err) {
      setError("An error occurd");
    }
  };
  return (
    <div className="bg">
      <div className="box">
        <center>
          <h1 style={{ fontFamily: "cursive" }}>LOGIN</h1>
        </center>
        <table>
          <tr>
            <td>
              <TextField
                id="outlined-password-input"
                label="Email"
                fullWidth
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    marginBottom: "10px",
                  },
                }}
                onChange={handleChange}
                name="email"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Avatar
                        sx={{
                          color: "black",
                          height: "30px",
                          backgroundColor: "lightgray",
                          width: "30px",
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </td>
          </tr>
          <tr>
            <td>
              <TextField
                id="outlined-password-input"
                label="Password"
                fullWidth
                name="password"
                onChange={handleChange}
                type={showPassword ? "text" : "password"} // Dynamically set the type
                autoComplete="current-password"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px",
                    marginBottom: "10px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={handleClickShowPassword}>
                        {" "}
                        {/* Call the handler function */}
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "grey" }} />
                        ) : (
                          <Visibility sx={{ color: "grey" }} />
                        )}{" "}
                        {/* Toggle visibility icon */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </td>
          </tr>
          <tr>
            <td style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Checkbox /> Remember me
              </div>
              <div className="row">ForgotPassword</div>
            </td>
          </tr>
          <center style={{ padding: "10px" }}>
            <Button
              variant="outlined"
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
                width: "100%",
              }}
              onClick={handleSubmit}
            >
              LOGIN
            </Button>
            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
            <p className="row" onClick={() => navigate("/signin")}>
              Didn't have account? Click Here
            </p>
          </center>
        </table>
      </div>
    </div>
  );
};

export default Login_page;
