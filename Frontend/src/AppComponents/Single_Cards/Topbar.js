import React, { useState } from 'react';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import {useNavigate} from "react-router-dom";
import './Topbar.css';
const Topbar = (props) => {
    const navigate = useNavigate();
    const [input, setInput] = useState();
    return (
        <div>
            <div className="topbar">
                <div className="menu"></div>
                <TextField
                    className="search"
                    placeholder="Search for Restaurant "
                    sx={{
                        margin: "10px 40px",
                        width: "50%",
                        height: "40px",
                        borderRadius: "40px",
                        color: "grey",
                        fontFamily: "cursive",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "40px", // Apply border-radius to the outline
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "grey", // Optional: Customize border color
                        }
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{color: "rgb(201, 42, 42)"}}/>
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                />
            </div>
            <div className="line"></div>
            <div className="bread">
                <div onClick={() => navigate("/")}>Home /</div>
                <div> TamilNadu /</div>
                <div> Coimbatore /</div>
                <div className="cur"> {props.name}</div>
            </div>
        </div>
    );
};

export default Topbar;