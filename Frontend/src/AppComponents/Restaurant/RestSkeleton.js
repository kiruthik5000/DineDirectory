import React from 'react';
import {Skeleton} from "@mui/material";

const RestSkeleton = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent:"start",
            gap:"15px",
            padding:"20px",
            borderRadius:"10px",
            width: "80%",
            margin: "20px auto",
            boxShadow: "10px 10px 10px #ddd"
        }}>
            <Skeleton
                variant="rectangular"
                height={200}
                width={300}
                sx={{borderRadius:"20px"}}
                />
            <div style={{width:'100%', margin:"20px"}}>
            <Skeleton
                variant="text"
                width="30%"
                height={30}
                />
            <Skeleton variant="text" width="40%" height={20}  />
            <Skeleton variant="text" width="40%" height={20} />

            </div>
        </div>
    );
};

export default RestSkeleton;