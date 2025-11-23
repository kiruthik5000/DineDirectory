import React, { useEffect, useState, useMemo } from "react";
import "./Hotel.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import HotelSkeleton from "./HotelSkeleton";
import Topbar from "./Topbar";
import Rating from "@mui/material/Rating";
import Review from "./Review";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";

const Hotel = () => {
    const { id } = useParams();

    const [details, setDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ userName: "", rating: 0, comment: "" });

    // Preload image set safely
    const images = useMemo(() => {
        try {
            return [
                require(`../pngs/rest${id % 20}.png`),
                require(`../pngs/arab${id % 4}.png`),
                require(`../pngs/as${id % 9}.png`),
                require(`../pngs/cof${id % 5}.png`),
            ];
        } catch (error) {
            console.error("Image load error:", error);
            return [];
        }
    }, [id]);

    // Fetch hotel details and reviews
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hotelRes, reviewsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/hotels/${id}`),
                    axios.get(`http://localhost:5000/api/reviews/hotel/${id}`)
                ]);
                setDetails(hotelRes.data);
                setReviews(reviewsRes.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Image carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveImageIndex((prev) => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [images.length]);

    const openModal = (img) => {
        setModalImage(img);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImage(null);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/reviews/create", {
                hotelId: parseInt(id),
                ...newReview
            });
            const reviewsRes = await axios.get(`http://localhost:5000/api/reviews/hotel/${id}`);
            setReviews(reviewsRes.data);
            setNewReview({ userName: "", rating: 0, comment: "" });
            setShowReviewForm(false);
        } catch (err) {
            console.error("Error posting review:", err);
        }
    };

    if (loading) return <HotelSkeleton />;

    return (
        <div className="hotel-page">
            <Topbar name={details.name} />

            <div className="hotel-container">
                {/* Left: Rating Box */}
                <div className="info-box">
                    <div className="info-row"><span className="label">Type:</span> {details.type}</div>
                    <div className="info-row"><span className="label">Location:</span> {details.location}</div>
                    <div className="info-row"><span className="label">Time:</span> {details.time}</div>
                    <div className="info-row"><span className="label">Price:</span> ₹{details.price}</div>
                    <div className="info-row"><span className="label">Phone:</span> {details.phone}</div>
                    <div className="info-row"><span className="label">Theme:</span> {details.theme}</div>

                    <div className="divider"></div>

                    <span className="label">Rating:</span>
                    <div className="rating-row">
                        <Rating value={details.rating || 0} precision={0.1} readOnly size="large" />
                        <span className="rating-num">{details.rating}</span>
                        <span className="rating-users">{details.no_of_rating} users</span>
                    </div>

                    <div className="divider"></div>

                    <div className="reviews-section">
                        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                            <span className="label">Reviews ({reviews.length})</span>
                            <Button variant="contained" size="small" onClick={() => setShowReviewForm(!showReviewForm)}>
                                {showReviewForm ? "Cancel" : "Write Review"}
                            </Button>
                        </div>
                        
                        {showReviewForm && (
                            <form onSubmit={handleSubmitReview} style={{marginTop: "10px", padding: "10px", border: "1px solid #ddd", borderRadius: "8px"}}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Your Name"
                                    value={newReview.userName}
                                    onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                                    required
                                    style={{marginBottom: "10px"}}
                                />
                                <div style={{marginBottom: "10px"}}>
                                    <span>Rating: </span>
                                    <Rating
                                        value={newReview.rating}
                                        onChange={(e, val) => setNewReview({...newReview, rating: val})}
                                        required
                                    />
                                </div>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Your Review"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    required
                                    inputProps={{minLength: 10, maxLength: 1000}}
                                />
                                <Button type="submit" variant="contained" style={{marginTop: "10px"}}>Submit</Button>
                            </form>
                        )}

                        {reviews.map((review) => (
                            <div key={review._id}>
                                <div style={{display: "flex", gap: "10px", marginTop: "15px"}}>
                                    <Avatar sx={{height: "40px", width: "40px"}}>{review.userName[0]}</Avatar>
                                    <div>
                                        <span style={{fontWeight: "bold", fontSize: "14px"}}>{review.userName}</span>
                                        {review.verified && <span style={{color: "green", fontSize: "12px"}}> ✓</span>}
                                        <br/>
                                        <Rating value={review.rating} readOnly size="small" precision={0.5}/>
                                        <p style={{margin: "5px 0"}}>{review.comment}</p>
                                        <span style={{fontSize: "12px", color: "gray"}}>{new Date(review.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="divider" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Image + Map */}
                <div className="right-section">
                    <div className="image-box" onClick={() => openModal(images[activeImageIndex])}>
                        <img src={images[activeImageIndex]} alt="Hotel" className="hotel-img" />
                    </div>

                    <div className="map-box">
                        <iframe
                            title="map"
                            width="100%"
                            height="220"
                            className="hotel-map"
                            src="https://www.openstreetmap.org/export/embed.html?bbox=77.04374925877912,10.911487757417747,77.06374925877912,10.931487757417747&layer=mapnik&marker=10.921487757417747,77.05374925877912&zoom=15"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* Full Screen Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content">
                        <img src={modalImage} alt="Preview" className="modal-image" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hotel;
