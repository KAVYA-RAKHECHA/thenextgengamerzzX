import { motion } from "framer-motion";
import {
	ResponsiveContainer,
	Radar,
	RadarChart,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
	Legend,
	Tooltip,
} from "recharts";
import { useGlobalState } from "../common/GlobalStateContext"; // Import global state

const customerSegmentationData = [
	{ subject: "Engagement", A: 120, B: 110, fullMark: 150 },
	{ subject: "Loyalty", A: 98, B: 130, fullMark: 150 },
	{ subject: "Satisfaction", A: 86, B: 130, fullMark: 150 },
	{ subject: "Spend", A: 99, B: 100, fullMark: 150 },
	{ subject: "Frequency", A: 85, B: 90, fullMark: 150 },
	{ subject: "Recency", A: 65, B: 85, fullMark: 150 },
];

const CustomerSegmentation = () => {
	const { theme } = useGlobalState(); // Access theme from global state

	// Set background, text, and chart styles based on the current theme
	const backgroundClass = theme === "dark" ? "bg-gray-800 bg-opacity-50" : "bg-white bg-opacity-80";
	const textColorClass = theme === "dark" ? "text-gray-100" : "text-gray-800";
	const borderColorClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
	const tooltipBackground = theme === "dark" ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.9)";
	const tooltipBorder = theme === "dark" ? "#4B5563" : "#D1D5DB";
	const tooltipTextColor = theme === "dark" ? "#E5E7EB" : "#1F2937";
	const polarGridStroke = theme === "dark" ? "#374151" : "#E5E7EB";
	const axisStrokeColor = theme === "dark" ? "#9CA3AF" : "#4B5563";

	return (
		<motion.div
			className={`rounded-xl p-6 shadow-lg border ${backgroundClass} ${borderColorClass}`}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		>
			<h2 className={`text-xl font-semibold ${textColorClass} mb-4`}>Customer Segmentation</h2>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<RadarChart cx="50%" cy="50%" outerRadius="80%" data={customerSegmentationData}>
						<PolarGrid stroke={polarGridStroke} />
						<PolarAngleAxis dataKey="subject" stroke={axisStrokeColor} />
						<PolarRadiusAxis angle={30} domain={[0, 150]} stroke={axisStrokeColor} />
						<Radar name="Segment A" dataKey="A" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
						<Radar name="Segment B" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
						<Legend />
						<Tooltip
							contentStyle={{
								backgroundColor: tooltipBackground,
								borderColor: tooltipBorder,
							}}
							itemStyle={{ color: tooltipTextColor }}
						/>
					</RadarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default CustomerSegmentation;
