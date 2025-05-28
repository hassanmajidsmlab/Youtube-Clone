import React, { useState, useEffect } from "react";
import "./playVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import { API_KEY, value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoid } = useParams();
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVideoData = async () => {
    try {
      setLoading(true);
      setError(null);
      const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoid}&key=${API_KEY}`;
      const response = await fetch(videoDetails_url);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error("No video data found");
      }
      
      setApiData(data.items[0]);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching video data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherData = async () => {
    if (!apiData) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch Channel Data
      const ChannelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
      const channelResponse = await fetch(ChannelData_url);
      
      if (!channelResponse.ok) {
        throw new Error(`Channel API request failed with status ${channelResponse.status}`);
      }
      
      const channelData = await channelResponse.json();
      
      if (!channelData.items || channelData.items.length === 0) {
        throw new Error("No channel data found");
      }
      
      setChannelData(channelData.items[0]);

      // Fetch Comment Data
      const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoid}&key=${API_KEY}`;
      const commentResponse = await fetch(comment_url);
      
      if (!commentResponse.ok) {
        // Comments might be disabled, so we don't treat this as a critical error
        console.warn("Failed to fetch comments, might be disabled for this video");
        setCommentData([]);
        return;
      }
      
      const commentData = await commentResponse.json();
      setCommentData(commentData.items || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching additional data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoid]);

  useEffect(() => {
    if (apiData) {
      fetchOtherData();
    }
  }, [apiData]);

  if (loading) {
    return (
      <div className="play-video loading">
        <div className="loading-spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="play-video error">
        <h3>Error loading video</h3>
        <p>{error}</p>
        <button onClick={fetchVideoData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="play-video">
      <div className="video-container">
        <iframe
          src={`https://www.youtube.com/embed/${videoid}?autoplay=1`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          title={apiData?.snippet?.title || "YouTube video"}
        ></iframe>
      </div>

      <h3>{apiData?.snippet?.title || "Video Title"}</h3>
      
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics?.viewCount) : "0"} views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div className="video-actions">
          <span>
            <img src={like} alt="Like" />
            {apiData ? value_converter(apiData.statistics?.likeCount) : "0"}
          </span>
          <span>
            <img src={dislike} alt="Dislike" />
          </span>
          <span>
            <img src={share} alt="Share" />
            Share
          </span>
          <span>
            <img src={save} alt="Save" />
            Save
          </span>
        </div>
      </div>
      
      <hr />
      
      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || ""}
          alt={apiData?.snippet?.channelTitle || "Channel"}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/48";
          }}
        />
        <div className="channel-info">
          <p>{apiData?.snippet?.channelTitle || "Channel Name"}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics?.subscriberCount)
              : "0"}{" "}
            Subscribers
          </span>
        </div>
        <button className="subscribe-btn">Subscribe</button>
      </div>
      
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250) + 
              (apiData.snippet.description.length > 250 ? "..." : "")
            : "No description available"}
        </p>
        <hr />
        
        <h4>
          {apiData ? value_converter(apiData.statistics?.commentCount) : "0"} Comments
        </h4>

        {commentData.length > 0 ? (
          commentData.map((item, index) => (
            <div key={index} className="comment">
              <img
                src={item.snippet.topLevelComment.snippet.authorProfileImageUrl}
                alt={item.snippet.topLevelComment.snippet.authorDisplayName}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/48";
                }}
              />
              <div>
                <h3>
                  {item.snippet.topLevelComment.snippet.authorDisplayName}
                  <span>
                    {moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}
                  </span>
                </h3>
                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                <div className="comment-actions">
                  <img src={like} alt="Like comment" />
                  <span>
                    {value_converter(
                      item.snippet.topLevelComment.snippet.likeCount
                    )}
                  </span>
                  <img src={dislike} alt="Dislike comment" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments available</p>
        )}
      </div>
    </div>
  );
};

export default PlayVideo;