import React, { useEffect, useState } from "react";
import { Button, Drawer, List, ListItem, ListItemText, } from "@mui/material";
import {useNavigate} from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from '@mui/icons-material/Search';
import "./Home.css";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import HotelCard from "../Single_Cards/HotelCard";

const Home = () => {
    const username = localStorage.getItem("user");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        console.log(username);
        if (username !== "undefined" && username !== "null") {
            setIsLoggedIn(true);
        }
    }, [username]);
    function generateRandomArray(length, min, max) {
        const uniqueNumbers = new Set();

        while (uniqueNumbers.size < length) {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            uniqueNumbers.add(randomNum);
        }

        return Array.from(uniqueNumbers);
    }
  const  hotels = generateRandomArray(6, 1, 25); // 10 random numbers between 1 and 100
    const menuItems = [
        { text: "Profile", action:true},
        { text: "Settings", action: false },
        {text: "Logout", action: true},
        { text: "Help", action: false},
    ];
    const types = ["Café", "Outdoor", "Night Outs", "Luxury"];
    const backend_types = ['cafe', 'outdoor', 'Night outs', 'luxury']
    return (
        <div className="background">
            <div className="MenuBar">
                <div className="logo"></div>
                <div className="right">
                    <Button sx={{ color: "rgb(201, 42, 42)" }} onClick={()=>navigate('/review')}>Review</Button>
                    {!isLoggedIn && [ "Login", "SignUp"].map((label, idx) => (
                        <Button
                            key={idx}
                            onClick={() => navigate(`/${label.toLowerCase()}`)}
                            sx={{ color: "rgb(201, 42, 42)" }}
                        >
                            {label}
                        </Button>
                    ))
                    }
                    {isLoggedIn && (
                        <div className="profilecont" onClick={()=>setDrawerOpen(true)}>
                            <div className="Profile"></div>
                            <div><span className="Username" style={{ color: "rgb(201, 42, 42)" }}>
                            {username}

                        </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="content-wrapper">
                <div className="loc">
                    <LocationOnIcon sx={{ color: "rgb(201, 42, 42)" }} />
                    <p>Set Up The Location ›</p>

                <TextField
                    className="search"
                    placeholder="Search for Restaurant Cuisine or a Dish"
                    onClick={()=>navigate('/search')}
                    sx={{
                        margin: "0 40px",
                        width: "70%",
                        height: "40px",
                        borderRadius: "40px",
                        color : "grey",
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
                                <SearchIcon sx={{ color: "rgb(201, 42, 42)" }} />
                            </InputAdornment>
                        ),
                    }}
                    variant="outlined"
                />
                </div>
                <div className="offer">
                    <div className="offerimg"></div>
                </div>
                <p className="section-title">What's on Your Mind?</p>
                <div className="food">
                    {types.map((type, idx) => (
                        <div>
                            <div
                                key={idx}
                                className={`order opt${idx + 1}`}
                                onClick={() => navigate(`/list/${backend_types[idx]}`)}
                            ></div>
                            <p className="order-name">{type}</p>
                        </div>

                    ))}
                </div>
                <Drawer anchor="right" open={drawerOpen} onClose={()=>setDrawerOpen(false)}>
                    <List>
                        {menuItems.map((item, idx) => (
                            <ListItem
                                key={idx}
                                button
                                sx={{ color: "rgb(201, 42, 42)" }}
                                onClick={()=>{
                                    if (idx == 0) {
                                        navigate('/profile');
                                        setDrawerOpen(false);
                                    }
                                    if (idx == 2) {
                                        setIsLoggedIn(false)
                                        localStorage.setItem("user", "null")
                                        setDrawerOpen(false);
                                    }
                                }}
                            >
                                <ListItemText primary={item.text}/>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                    <div className="line" style={{width:'80%'}}></div>
            </div>
            <div className="cards-holder">
            {hotels.map((val, i) => (
                <div onClick={()=>navigate(`/hotel/${val}`)}>
                <HotelCard id={val} key={i}  />
                </div>
            ))}
            </div>
        </div>

    );

};

export default Home;
