import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";

const CardSkeleton = () => {
    return (
        <Card
            sx={{
                Width: "450px",
                margin: "16px",
                borderRadius: "30px",
                height: "auto",
                boxShadow:" 0 4px 6px rgba(0, 0, 0, 0.1)"
            }}
        >
            <Skeleton
                variant="rectangular"
                width="300px"
                height={140}
                sx={{ borderRadius: "30px 30px 0 0" }}
            />
            <CardContent>
                {/* Skeleton for the Hotel Name */}
                <Skeleton
                    variant="text"
                    width="60%"
                    height={30}
                    sx={{ marginBottom: "16px" }}
                />
                {/* Skeleton for the Rating */}
                <Skeleton
                    variant="rectangular"
                    width="30%"
                    height={20}
                    sx={{ marginBottom: "16px" }}
                />
                {/* Skeleton for the Hotel Type and Location */}
                <Skeleton variant="text" width="80%" height={20} sx={{ marginBottom: "8px" }} />
                <Skeleton variant="text" width="50%" height={20} />
            </CardContent>
        </Card>
    );
};

export default CardSkeleton;
