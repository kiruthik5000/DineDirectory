import React from 'react';
import Avatar from "@mui/material/Avatar";

const Review = () => {
    const [expanded, setExpanded] = React.useState(false);
    return (
        <div>
            <div style={{
                display: 'flex',
                gap: '10px',
                margin: '0',
            }}>
                <Avatar sx={{ height: '40px', width: '40px' }} />
                <div style={{
                    maxHeight: expanded ? 'none' : '4rem',
                    overflow: 'hidden',
                    maxWidth: '80%',
                }}>
                    <span style={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                    }}>Name<br/></span>
                    <span onClick={()=>setExpanded(!expanded)} style={{ cursor: 'pointer'}}>
                        {expanded ? "The food was absolutely delicious! The flavors were authentic, and every dish was cooked to perfection. I particularly loved the hummus and lamb kebabs – definitely a highlight of the meal." :
                            "The food was absolutely delicious..."}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Review;
