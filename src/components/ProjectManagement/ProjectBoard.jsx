import React, { useState, useEffect } from "react";
import { DndContext, closestCenter, useDroppable } from "@dnd-kit/core";
import { useGlobalState } from "../common/GlobalStateContext"; // adjust path if needed

import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useForm } from "react-hook-form";

// Sortable task card component
const Card = ({ task, onEdit, onDelete, onComplete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const { theme } = useGlobalState();
  const isDark = theme === "dark";
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-blue-500 text-white px-3 py-2 rounded shadow mb-2 cursor-pointer"
    >
      <div className="font-semibold">{task.title}</div>
      {task.description && <div className="text-sm">{task.description}</div>}
      {task.dueDate && (
        <div className="text-xs italic">Due: {task.dueDate}</div>
      )}
      <div className="text-xs mt-1">Status: {task.status}</div>
      <div className="flex justify-end space-x-2 mt-1">
      </div>
    </div>
  );
};

// Droppable wrapper for each column
const DroppableColumn = ({ columnId, children }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  return (
    <div ref={setNodeRef} className="min-h-[100px]">
      {children}
    </div>
  );
};

const ProjectBoard = () => {
  const { theme } = useGlobalState();
  const isDark = theme === "dark";

  // Tabs state: columns for each status
  const [tabs, setTabs] = useState({
    planning: [],
    scripting: [],
    recording: [],
    editing: [],
    review: [],
    complete: [],
  });
  const [editProject, setEditProject] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Fetch projects from backend and organize them in columns by status
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects");
        if (response.ok) {
          const data = await response.json();
          // Organize tasks by their status
          const organizedTabs = {
            planning: [],
            scripting: [],
            recording: [],
            editing: [],
            review: [],
            complete: [],
          };
          // Map status 'missing' or 'completed' to 'complete'
          data.forEach((project) => {
            // Use _id as id if id missing
            if (!project.id && project._id) project.id = project._id;
            if (!project.status || project.status === "completed") {
              project.status = "complete";
            }
            if (organizedTabs[project.status]) {
              organizedTabs[project.status].push(project);
            }
          });
          setTabs(organizedTabs);
        } else {
          throw new Error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  // Drag-and-drop handler
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let sourceTab = "",
      destTab = "";

    // Determine source and destination tabs
    for (const tab in tabs) {
      if (tabs[tab].some((t) => t.id === active.id)) sourceTab = tab;
      if (tab === over.id || tabs[tab].some((t) => t.id === over.id)) destTab = tab;
    }

    if (sourceTab && destTab) {
      const movedItem = tabs[sourceTab].find((t) => t.id === active.id);
      // Update state and status
      setTabs((prev) => {
        const updated = { ...prev };
        updated[sourceTab] = updated[sourceTab].filter((t) => t.id !== active.id);
        // update the status property of the moved item
        const updatedMovedItem = { ...movedItem, status: destTab };
        updated[destTab] = [updatedMovedItem, ...updated[destTab]];
        return updated;
      });
      // Update status in the database
      try {
        await fetch(`http://localhost:3000/projects/status/${movedItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: destTab }),
        });
      } catch (error) {
        console.error("Failed to update project status", error);
      }
    }
  };

  const validateDueDate = (date) => {
    if (!date) return true;
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return "Due date cannot be in the past";
    }
    return true;
  };

  const handleAddProject = async (data) => {
    if (!data.title.trim()) {
      alert("Title is required");
      return;
    }
    if (validateDueDate(data.dueDate) !== true) {
      alert("Due date cannot be in the past");
      return;
    }
    try {
      // Always set status to 'planning' when adding new project
      const projectData = { ...data, status: "planning" };
      const response = await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });
      if (!response.ok) throw new Error("Failed to add project");
      const json = await response.json();
      const createdProject = json.project ? json.project : json;
      setTabs((prev) => ({
        ...prev,
        planning: [
          {
            id: createdProject.id || createdProject._id,
            title: createdProject.title,
            description: createdProject.description || "",
            dueDate: createdProject.dueDate || "",
            status: "planning"
          },
          ...prev.planning,
        ],
      }));
      reset();
    } catch (error) {
      console.error("Failed to add project", error);
      alert("Failed to add project");
    }
  };

  const handleEditClick = (task) => {
    setEditProject(task);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editProject.title.trim()) {
      alert("Title is required");
      return;
    }
    if (!validateDueDate(editProject.dueDate)) {
      alert("Due date cannot be in the past");
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/projects/${editProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editProject.title,
          description: editProject.description,
          dueDate: editProject.dueDate,
        }),
      });
      if (!response.ok) throw new Error("Failed to update project");
      setTabs((prev) => {
        const updated = { ...prev };
        for (const tab in updated) {
          updated[tab] = updated[tab].map((t) =>
            t.id === editProject.id ? { ...t, ...editProject } : t
          );
        }
        return updated;
      });
      setEditProject(null);
    } catch (error) {
      console.error("Failed to update project", error);
      alert("Failed to update project");
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const response = await fetch(`http://localhost:3000/projects/${task.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete project");
      setTabs((prev) => {
        const updated = { ...prev };
        for (const tab in updated) {
          updated[tab] = updated[tab].filter((t) => t.id !== task.id);
        }
        return updated;
      });
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Failed to delete project");
    }
  };

  const handleComplete = async (task) => {
    try {
      const response = await fetch(`http://localhost:3000/projects/status/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "complete" }),
      });
      if (!response.ok) throw new Error("Failed to complete project");
      setTabs((prev) => {
        const updated = { ...prev };
        for (const tab in updated) {
          updated[tab] = updated[tab].filter((t) => t.id !== task.id);
        }
        updated.complete = [task, ...updated.complete];
        return updated;
      });
    } catch (error) {
      console.error("Failed to complete project", error);
      alert("Failed to complete project");
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>

      {/* Add Project Button */}
      <div className={`mb-6 p-4 rounded shadow max-w-full mx-auto ${isDark ? "bg-gray-800 text-white " : "bg-white text-black"}`}>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-all"
        >
          Add New Project
        </button>
      </div>
      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded shadow max-w-md w-full ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-xl font-semibold mb-3">Add New Project</h2>
            <form
              onSubmit={handleSubmit((data) => {
                handleAddProject(data);
                setShowAddModal(false);
              })}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Title"
                {...register("title", { required: "Title is required" })}
                className={`w-full px-5 py-3 border-2 ${isDark ? "border-gray-700 bg-[#1e1f26] text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.title && <span className="text-red-500 text-xs">{errors.title.message}</span>}
              <input
                type="text"
                placeholder="Description"
                {...register("description")}
                className={`w-full px-5 py-3 border-2 ${isDark ? "border-gray-700 bg-[#1e1f26] text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <input
                type="date"
                {...register("dueDate", { validate: validateDueDate })}
                className={`w-full px-5 py-3 border-2 ${isDark ? "border-gray-700 bg-[#1e1f26] text-white" : "border-gray-300 bg-white text-black"} rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.dueDate && <span className="text-red-500 text-xs">{errors.dueDate.message}</span>}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded shadow max-w-md w-full ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h2 className="text-xl font-semibold mb-3">Edit Project</h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={editProject.title}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={editProject.description}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <input
              type="date"
              name="dueDate"
              value={editProject.dueDate}
              onChange={handleEditChange}
              className="w-full mb-2 p-2 border border-gray-300 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditProject(null)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(tabs).map(([key, tasks]) => (
                        <div key={key} id={key} className={`rounded-lg p-4 shadow ${isDark ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white border border-gray-50" : "bg-white text-black border border-gray-500"}`}>
              <h3 className="text-lg font-semibold mb-3 capitalize">{key}</h3>
              <SortableContext
                items={tasks.map((t) => t.id)}
                strategy={rectSortingStrategy}
              >
                <DroppableColumn columnId={key}>
                  {tasks.length === 0 ? (
                    <div className="text-gray-400 text-sm text-center py-4">
                      Drop here
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <Card
                        key={task.id}
                        task={task}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        onComplete={key !== "complete" ? handleComplete : null}
                      />
                    ))
                  )}
                </DroppableColumn>
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default ProjectBoard;
