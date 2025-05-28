import React, { useState, useEffect } from "react";
import "./Feed.css";
import { Link } from "react-router-dom";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";

const Feed = ({ category }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=50&regionCode=PK&videoCategoryId=${category}&key=${API_KEY}`;
      
      const response = await fetch(videoList_url);
      if (!response.ok) {
        throw new Error(`Failed to fetch videos: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.items) {
        throw new Error("No video items found in response");
      }
      
      setData(result.items);
    } catch (err) {
      console.error("Error in fetchData:", err);
      setError(err.message);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);


  return (
    <div className="feed">
      {data.map((item) => (
        <Link
          to={`/video/${item.snippet.categoryId}/${item.id}`}
          className="card"
          key={item.id}
        >
          <img
            src={item.snippet.thumbnails.medium.url}
            alt={item.snippet.title}
            className="thumbnail"
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/320x180";
              e.target.alt = "Thumbnail not available";
            }}
          />
          <div className="video-info">
            <h2>{item.snippet.title}</h2>
            <h3>{item.snippet.channelTitle}</h3>
            <p>
              {value_converter(item.statistics?.viewCount || 0)} views •{" "}
              {moment(item.snippet.publishedAt).fromNow()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Feed;