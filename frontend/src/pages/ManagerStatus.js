import React, { useEffect, useState, useContext } from "react";
import Sidebar from "./Sidebar";
import API from "../axios";
import { AuthContext } from "../contexts/AuthContext";
import { useMediaQuery } from "react-responsive";

const ManagerStatus = () => {
  const { user } = useContext(AuthContext);
  const [userSessions, setUserSessions] = useState([]);
  const isLargeScreen = useMediaQuery({ minWidth: 992 });

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/auth/sessions");
      const filtered = res.data.filter(
        (s) => s.user.role === "ADMIN" || s.user.role === "USER"
      );
      setUserSessions(filtered);
    } catch (err) {
      console.error("Error fetching sessions:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
  };

  const formatTime12Hour = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "—"
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      <Sidebar />
      <div
        className="flex-grow-1 px-3 py-4"
        style={{
          marginLeft: isLargeScreen ? "250px" : "0",
          marginRight: isLargeScreen ? "50px" : "0",
        }}
      >
        <div className="container-fluid">
          <h1 className="mb-4 mt-4">{user?.name || "Manager"}'s Status View</h1>

          <div className="card p-3 shadow-sm">
            <h3 className="mb-3">User Login & Working Hours Status</h3>
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Login Time</th>
                    <th>Logout Time</th>
                    <th>Worked Hours</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {userSessions.map((session, i) => (
                    <tr key={`${session.user.id}-${session.firstLogin}`}>
                      <td>{i + 1}</td>
                      <td>{formatDate(session.firstLogin)}</td>
                      <td>{session.user.name}</td>
                      <td>{session.user.role}</td>
                      <td>{formatTime12Hour(session.firstLogin)}</td>
                      <td>{formatTime12Hour(session.lastLogout)}</td>
                      <td>
                        {session.totalHours
                          ? session.totalHours.toFixed(2)
                          : "—"}
                      </td>
                      <td>
                        {session.isActive ? (
                          <span className="badge bg-success">Active</span>
                        ) : (
                          <span className="badge bg-secondary">Logged Out</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {userSessions.length === 0 && (
                    <tr>
                      <td colSpan="8">No sessions found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerStatus;
