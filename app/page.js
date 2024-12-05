"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [classes, setClasses] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState("");
  const router = useRouter();
  
  const getClasses = async () => {
    fetch("/api/getClasses")
    .then((res) => res.json())
    .catch((err) => console.log(err))
    .then((data) => {
      setClasses(data.classes);
      localStorage.setItem("classes", JSON.stringify(data.classes));
    })
    .catch((err) => {
      console.log(err);
    });
  };
  
  useEffect(() => {
    const localuser = localStorage.getItem("currentUser") || null;
    // Check if user exists and parse only if it does
    if (localuser === null) {
      router.push("/auth");
      return; // Exit early if no user
    }

    const currentUser = JSON.parse(localuser); // Use existing localuser variable
    if (!currentUser?.role || currentUser.role !== "teacher") {
      router.push("/student-dashboard");
      return;
    }
    getClasses();
    setClasses(JSON.parse(localStorage.getItem("classes") || "[]"));
  }, []);

  const handleAddClass = () => {
    fetch("/api/createClass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClass),
    })
      .then((res) => res.json())
      .then((data) => {
        setClasses([...classes, data.class]);
        localStorage.setItem(
          "classes",
          JSON.stringify([...classes, data.class])
        );
        setShowAddClass(false);
      });
  };

  return (
    <div className="p-8 ">
      <h1 className="text-3xl mb-8">Classes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {classes &&
          classes.length > 0 &&
          classes.map((cls) => (
            <div
              key={cls?._id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer text-black w-full flex justify-between"
              onClick={() => router.push(`/class/${cls?._id}`)}
            >
              <h2 className="text-xl">{cls?.name || "Untitled Class"}</h2>
              <button
                className="bg-red-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.stopPropagation();
                  e.target.disabled = true;
                  e.currentTarget.innerText = "Deleting...";
                  const confirmDelete = confirm(
                    "Are you sure you want to delete this class?"
                  );
                  if (confirmDelete) {
                    fetch(`/api/deleteClass/${cls._id}`, {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        setClasses(classes.filter((c) => c._id !== cls._id));
                        localStorage.setItem(
                          "classes",
                          JSON.stringify(
                            classes.filter((c) => c._id !== cls._id)
                          )
                        );
                      });
                  } else {
                    return;
                  }
                }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      <button
        className="bg-blue-500 text-white p-4 rounded-lg mt-4"
        onClick={() => setShowAddClass(true)}
      >
        Add a Class
      </button>

      {showAddClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white text-black p-8 rounded-lg">
            <h2 className="text-2xl mb-4">Add New Class</h2>
            <input
              type="text"
              placeholder="Subject Name"
              className="w-full mb-4 p-2 border rounded"
              value={newClass.subject}
              onChange={(e) => setNewClass(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setShowAddClass(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddClass}
                disabled={!newClass || newClass.length < 3}
              >
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
