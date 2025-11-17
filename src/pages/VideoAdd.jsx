import { useEffect, useState } from "react";
import { Video, Upload, CalendarCheck, CalendarRange } from "lucide-react";
import { motion } from "framer-motion";
import { useGlobalState } from "../components/common/GlobalStateContext";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UploadVideo from "../components/videoupload/UploadVideo";
import axios from "axios";

const UsersPage = () => {
	const { theme } = useGlobalState();
	const isDark = theme === "dark";

	const [videoStats, setVideoStats] = useState({
		totalVideos: 0,
		uploadedToday: 0,
		uploadedThisMonth: 0,
		uploadedThisYear: 0,
	});

	useEffect(() => {
		const fetchVideos = async () => {
			try {
				const res = await axios.get("http://localhost:3000/videos");
				const videos = res.data;

				const today = new Date();
				today.setHours(0, 0, 0, 0);

				const thisMonth = today.getMonth();
				const thisYear = today.getFullYear();

				const uploadedToday = videos.filter(v => {
					const uploadedDate = new Date(v.uploadedAt);
					return uploadedDate >= today;
				}).length;

				const uploadedThisMonth = videos.filter(v => {
					const uploadedDate = new Date(v.uploadedAt);
					return (
						uploadedDate.getMonth() === thisMonth &&
						uploadedDate.getFullYear() === thisYear
					);
				}).length;

				const uploadedThisYear = videos.filter(v => {
					const uploadedDate = new Date(v.uploadedAt);
					return uploadedDate.getFullYear() === thisYear;
				}).length;

				setVideoStats({
					totalVideos: videos.length,
					uploadedToday,
					uploadedThisMonth,
					uploadedThisYear,
				});
			} catch (error) {
				console.error("Error fetching video stats:", error);
			}
		};

		fetchVideos();
	}, []);

	return (
		<div className={`flex-1 overflow-auto relative z-10 ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
			<Header title='Video Uploads' />

			<main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard
						isDark={isDark}
						name='Total Videos'
						icon={Video}
						value={videoStats.totalVideos.toLocaleString()}
						color='#6366F1'
					/>
					<StatCard
						isDark={isDark}
						name='Videos Uploaded Today'
						icon={Upload}
						value={videoStats.uploadedToday}
						color='#10B981'
					/>
					<StatCard
						isDark={isDark}
						name='Videos Uploaded This Month'
						icon={CalendarCheck}
						value={videoStats.uploadedThisMonth.toLocaleString()}
						color='#F59E0B'
					/>
					<StatCard
						isDark={isDark}
						name='Videos Uploaded This Year'
						icon={CalendarRange}
						value={videoStats.uploadedThisYear.toLocaleString()}
						color='#EF4444'
					/>
				</motion.div>

				<UploadVideo />
			</main>
		</div>
	);
};

export default UsersPage;