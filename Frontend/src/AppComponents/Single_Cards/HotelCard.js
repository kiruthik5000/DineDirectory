import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import axios from "axios";
import './HotelCard.css'
import CardSkeleton from "./CardSkeleton";

const HotelCard = (props) => {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState({});
    const num = props.id % 20;
    const hotelImage = require(`../pngs/rest${num}.png`);
    useEffect(() => {
        let isMounted = true; // To prevent state updates on unmounted components
        const fetchHotelDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/hotels/${props.id}`);
                if (isMounted) {
                    setDetails(response.data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching hotel details:", error);
            }
        };

        fetchHotelDetails();
        return () => {
            isMounted = false; // Cleanup
        };
    }, [props.id]);
    console.log(details);
    return (
        <div>
            {loading ? <CardSkeleton/> :
                <div className="grids" id="grids">
                    <Card
                        sx={{
                            maxWidth: "450px",
                            margin: "16px",
                            borderRadius: "30px",
                            height: "auto",
                        }}
                        className="cards"
                    >
                        <CardMedia
                            sx={{height: 140}}
                            title={details.name}
                            image={hotelImage} // Add a placeholder if no image URL
                        />
                        <CardContent
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                            className="cardContent"
                        >
                            <Typography variant="h5" component="div" className="cardText">
                                {details.name || "Hotel Name"}
                            </Typography>

                            <Rating
                                name="half-rating-read"
                                value={details.rating || 0}
                                precision={0.1}
                                readOnly
                            />
                        </CardContent>
                        <Typography
                            variant="body2"
                            sx={{color: "text.secondary", padding: "16px"}}
                            className="cardText"
                        >
                            {details.type || "Hotel Type"}
                            <br/>
                            {details.location || "Hotel Location"}
                            <br/>
                            <span style={{color: "green"}}>Open now</span> {details.time || ""}
                        </Typography>
                    </Card>
                </div>
            }
        </div>
    );
};

export default HotelCard;
