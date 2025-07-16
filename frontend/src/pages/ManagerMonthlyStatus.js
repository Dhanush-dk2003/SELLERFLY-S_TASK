import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./Sidebar";
import API from "../axios";
import { AuthContext } from "../contexts/AuthContext";
import { useMediaQuery } from "react-responsive";

const ManagerMonthlyStatus = () => {
  const { user } = useContext(AuthContext);
  const [userSessions, setUserSessions] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isLargeScreen = useMediaQuery({ minWidth: 992 });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Only fetch if both dates are selected
        if (!startDate || !endDate) {
          setUserSessions([]);
          return;
        }

        const res = await API.get(`/auth/sessions/range?start=${startDate}&end=${endDate}`);
        setUserSessions(res.data);
      } catch (err) {
        console.error("Error fetching sessions:", err);
        setUserSessions([]);
      }
    };

    fetchSessions();
  }, [startDate, endDate]);

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

  // Filter sessions by name on frontend
  const filteredSessions = userSessions.filter((s) =>
    s.user.name.toLowerCase().includes(searchName.toLowerCase())
  );

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
          <h1 className="mb-4 mt-4">{user?.name || "Manager"}'s Review</h1>

          <div className="d-flex flex-column flex-md-row gap-2 mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              style={{ maxWidth: "200px" }}
            />
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ maxWidth: "200px" }}
            />
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ maxWidth: "200px" }}
            />
          </div>

          <div className="card p-3 shadow-sm">
            <h3 className="mb-3">Attendance of the Employees</h3>
            <div className="table-responsive">
              <table className="table table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Name</th>
                    <th>First Login</th>
                    <th>Last Logout</th>
                    <th>Worked Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, i) => (
                    <tr key={`${session.user.id}-${session.firstLogin}`}>
                      <td>{i + 1}</td>
                      <td>{formatDate(session.firstLogin)}</td>
                      <td>{session.user.name}</td>
                      <td>{formatTime12Hour(session.firstLogin)}</td>
                      <td>{formatTime12Hour(session.lastLogout)}</td>
                      <td>
                        {session.totalHours
                          ? session.totalHours.toFixed(2)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                  {filteredSessions.length === 0 && (
                    <tr>
                      <td colSpan="6">No data found</td>
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

export default ManagerMonthlyStatus;
