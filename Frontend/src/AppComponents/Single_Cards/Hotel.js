import React, { useEffect, useState } from "react";
import "./Hotel.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import HotelSkeleton from "./HotelSkeleton";
import Topbar from "./Topbar";
import Rating from "@mui/material/Rating";
import Review from "./Review";

const Hotel = () => {
    const { id } = useParams();
    const [details, setDetails] = React.useState({});
    const [loading, setLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const imgs = [
        require(`../pngs/rest${id % 20}.png`),
        require(`../pngs/arab${id % 4}.png`),
        require(`../pngs/as${id % 9}.png`),
        require(`../pngs/cof${id % 5}.png`),
    ];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/hotels/${id}`);
                if (isMounted) {
                    setDetails(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
        const interval = setInterval(() => {
            setIdx((prevIdx) => (prevIdx + 1) % imgs.length);
        }, 3000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [id, imgs.length]);
    const openModal = (image) => {
        setModalImage(image);
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };
    return (
        <div>
            <Topbar name={details.name} />
            {loading ? (
                <HotelSkeleton />
            ) : (
                <div className="container">
                    <div className="rating-box">
                        <span className="title">Rating</span>
                        <div className="rating">
                            <Rating
                                name="half-rating-read"
                                value={details.rating || 0}
                                precision={0.1}
                                size="large"
                                readOnly
                            />
                            <span className="title"> {details.rating} </span><span>{details.no_of_rating} users</span>
                        </div>
                        <div className="line"></div>
                        <div className="reviews">
                            <span className="title">Reviews</span>
                            {Array.from({length:4}, (_,i)=><div key={i}>
                                <Review/>
                                <div className="line"/>
                            </div>
                                )}
                        </div>
                    </div>
                    <div className="right-box">
                    <div className="image" onClick={() => openModal(imgs[idx])}>
                        <img
                            src={imgs[idx]}
                            alt={`Hotel Image ${idx}`}
                            style={{
                                height: "400px",
                                minWidth: "400px",
                                borderRadius: "10px",
                                backgroundSize: "contain",
                                transition: "transform 0.3s ease-in-out",
                            }}
                        />
                    </div>
                        <div className="map">
                            <iframe
                                title="hotel-location-map"
                                width="300"
                                height="200"
                                style={{
                                    border: "1px solid gray",
                                    borderRadius: "8px",
                                    overflow: "hidden",
                                }}
                                src="https://www.openstreetmap.org/export/embed.html?bbox=77.04374925877912,10.911487757417747,77.06374925877912,10.931487757417747&layer=mapnik&marker=10.921487757417747,77.05374925877912&zoom=15"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content">
                        <img src={modalImage} alt="Preview"/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotel;
