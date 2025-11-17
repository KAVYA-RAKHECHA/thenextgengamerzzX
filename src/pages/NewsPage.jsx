import Header from "../components/common/Header";
import { useGlobalState } from "../components/common/GlobalStateContext"; // adjust path if needed

import AIPoweredInsights from "../components/news/AIPoweredInsights";

const NewsPage = () => {
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  return (
    <div className={`flex-1 overflow-auto relative z-10 ${isDark ? "bg-gray-800" : "bg-white-900"}`}>
      <Header title={"Recent News "} />

      <main className={`max-w-7xl mx-auto py-6 px-4 lg:px-8 ${isDark ? "text-white" : "text-black"}`}>
        <AIPoweredInsights isDark={isDark} />
      </main>
    </div>
  );
};

export default NewsPage;