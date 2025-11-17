import React from "react";
import VideoGallery from "../components/videoupload/VideoGallery";
import Header from "../components/common/Header"
const userStats = {
    totalUsers: 152845,
    newUsersToday: 243,
    activeUsers: 98520,
    churnRate: "2.4%",
};
import StatCard from "../components/common/StatCard";
const VideoGalleryPage = () => {

  return (
    
    <div className="min-h-screen p-6">
        
<Header title="Video Gallery" />

<div className="mx-5 my-5 ">
      <VideoGallery />
      </div>
    </div>
  );
};

export default VideoGalleryPage;