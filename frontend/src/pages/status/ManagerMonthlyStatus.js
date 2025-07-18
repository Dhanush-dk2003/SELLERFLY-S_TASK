import React, { useState, useEffect } from "react";
import API from "../../axios";

const ManagerMonthlyStatus = () => {
  const [userSessions, setUserSessions] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchSessions = async () => {
      try {
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

  const formatHoursToHHMM = (decimalHours) => {
    if (!decimalHours) return "—";
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  };

  const filteredSessions = userSessions.filter((s) =>
    s.user.name.toLowerCase().includes(searchName.toLowerCase())
  );

  return (
    <div className="d-flex flex-column flex-md-row">
     
      <div
        className="flex-grow-1 px-3 py-4">
        <div className="container-fluid">
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
                      <td>{session.totalHours ? formatHoursToHHMM(session.totalHours) : "—"}</td>
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
