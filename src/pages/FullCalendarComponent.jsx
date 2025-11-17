import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Header from "../components/common/Header";
import { useGlobalState } from "../components/common/GlobalStateContext";

export default function FullCalendarComponent() {
  const [events, setEvents] = useState([]);

  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects-calendar");
        if (response.ok) {
          const data = await response.json();
          // Filter out completed tasks
          const filteredEvents = data.filter(project => project.status !== 'complete');
          const calendarEvents = filteredEvents.map((project) => ({
            title: project.title,
            start: project.dueDate,
            description: project.description,
            id: project.id || project._id,
            status: project.status,
          }));
          setEvents(calendarEvents);
        } else {
          throw new Error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className={`min-h-screen p-4 ${isDark ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-gray-100 to-gray-200 text-black"}`}>
      <Header title={"Calendar"} />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className={`max-w-10xl rounded-2xl shadow-xl mt-5 p-6 ${isDark ? "bg-[#1e1f26] text-white" : "bg-white text-black"}`}>
          <h2 className="text-4xl font-extrabold text-center justify-content-center align-items-center mb-6 text-indigo-600">Schedules</h2>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="auto"
            events={events}
            editable={false}
            selectable={false}
            dayMaxEvents={true}
            dateClick={(arg) => {
              // Handle date click for event details if needed
            }}
            dayHeaderClassNames={() => isDark ? "bg-[#2a2c36] text-white" : "bg-gray-100 text-black"}
            eventClassNames={(info) => {
              // Apply low transparency red background to the current month's tasks
              const today = new Date();
              const currentMonth = today.getMonth();
              const eventMonth = new Date(info.event.start).getMonth();
              if (eventMonth === currentMonth) {
                return "bg-red-300 bg-opacity-50"; // Semi-transparent red
              }
              return "";
            }}
            eventContent={(eventInfo) => {
              return (
                <div style={{ whiteSpace: 'nowrap',color: 'white', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <strong>{eventInfo.event.title}</strong> <br />
                  <span>{eventInfo.event.extendedProps.description}</span>
                </div>
              );
            }}
            eventDidMount={(info) => {
              // Ensure the title does not overflow
              const eventEl = info.el;
              const eventTitle = eventEl.querySelector('.fc-event-title');
              if (eventTitle) {
                eventTitle.style.whiteSpace = 'nowrap';
                eventTitle.style.overflow = 'hidden';
                eventTitle.style.textOverflow = 'ellipsis';
              }
            }}
            dayCellClassNames={(args) => {
              // Make each tile bigger
              return "p-4"; // Adjust tile size
            }}
            eventRender={(info) => {
              // Handle rendering for multiple events in a day
              if (info.event.start.getDate() === info.event.end?.getDate()) {
                // Allow stacking of events in a single day
                info.el.style.position = "relative";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}