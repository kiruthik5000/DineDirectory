import "./Rest2.css";
import Content from "./Content";
import {useEffect, useState} from "react";
import axios from "axios";
import RestSkeleton from "./RestSkeleton";
import Topbar from "../Single_Cards/Topbar";
import {useParams} from "react-router-dom";

const Rest2 = () => {
    const {type} = useParams();
    const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  useEffect(()=>{
      let isMounted = true;
      const fetchData = async () => {
          try{
              const res = await axios.get(`http://localhost:5000/api/hotels?type=${type}`);
              if(isMounted){
                  console.log(res);
                  setData(res.data);
                  setLoading(false);
              }
          }catch(error){
              console.log(error);
          }
      };
      fetchData();
      return ()=>{
        isMounted = false;
      }
  },[type])
  return (
    <>
        <Topbar name={type}/>
      <div
        style={{
          fontFamily: "cursive",
          paddingTop: "16px",
          paddingLeft: "100px",
          fontSize: "28px",
        }}
      >
        <span>Restaurants with {type} Seating Near You</span>
      </div>
      <div className="filter">
        <div className="filt">
          <span>⨬ filter </span>
        </div>
        <div className="filt">
          <span>Offers</span>
        </div>
        <div className="filt">
          <span>Rating 4.5+</span>
        </div>
        <div className="filt">
          <span>Open Now</span>
        </div>
      </div>
        {loading ? (
            <div className="contDisp">
                {Array.from({ length: 8 }, (_, i) => (
                    <RestSkeleton key={i} />
                ))}
            </div>
        ) : (
            <div className="contDisp">
                {data.map((val, i) => (
                    <Content key={i} data={val} />
                ))}
            </div>
        )}
    </>
  );
};

export default Rest2;
