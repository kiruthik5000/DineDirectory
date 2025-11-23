import React, {useState} from 'react';
import { Button } from "@mui/material";
import './Content.css';
import Rating from "@mui/material/Rating";
import BookDialog from "./BookDialog";
import {useNavigate} from "react-router-dom";

const Content = (props) => {
    const navigate = useNavigate();
    const [isbook, setIsBook] = useState(false);
    const num = props.data.id % 20;
    const imageUrl = require(`../pngs/rest${num}.png`); // Ensure images are in the public folder
    const handleBookClick = (id) => {
        setIsBook(true)
    };
    const closeDialog = () => {
        setIsBook(false);  // Close the dialog by resetting the state
    };
    return (
        <div className="cont"
            onClick={()=>navigate(`/hotel/${props.data.id}`)}
            style={{cursor:'pointer'}}
            >
            <div
                className="photo"
                style={{
                    backgroundImage: `url(${imageUrl})`
                }}
            ></div>
            <div style={{ margin:'30px'}}>
                <span style={{fontSize: '20px', fontWeight: 'bold' }}>{props.data.name}<br /></span>
                <span>{props.data.location}</span>
            </div>
            <div className="rating" style={{margin: "10px 0"}}>
                <span style={{fontSize:'25px', fontWeight:'bold'}}>{props.data.rating}</span><br/>
                <Rating
                    name="read-only"
                    value={props.data.rating}
                    precision={0.5}
                    readOnly
                />

            </div>

            <div style={{alignContent:'right'}}>
                <Button variant="contained" onClick={()=>handleBookClick(props.data.id)} sx={{ backgroundColor: 'black' }}>
                    Book A Table
                </Button>
                {/* <Button variant="contained"  sx={{ backgroundColor: 'black', marginLeft: '10px' }}>
                    Review
                </Button> */}
            </div>
            {isbook && 
            <BookDialog onClose={closeDialog} />
            }
        </div>
    );
};

export default Content;
