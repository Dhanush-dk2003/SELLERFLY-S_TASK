import React, { useState } from "react";

const ViewProfile = () => {
  const [searchId, setSearchId] = useState("");
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSearch = () => {
    if (searchId === "SKSY001") {
      setProfile();
    } else {
      setProfile(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleDelete = () => setProfile(null);

  return (
    <div className="d-flex">
      <div className="container py-4">
        <div className="d-flex justify-content-end align-items-center mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Employee ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{ maxWidth: "300px" }}
          />

          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        {profile && (
          <div className="card shadow border p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">Employee Profile</h4>
              {!isEditing && (
                <button
                  className="btn btn-outline-primary"
                  onClick={handleEdit}
                >
                  Edit
                </button>
              )}
            </div>

            <form>
              <div className="row">
                {/* Profile Picture */}
                <div className="col-md-3 d-flex justify-content-center align-items-start">
                  <div className="text-center">
                    <div
                      className="rounded-circle border border-secondary mb-2 d-flex align-items-center justify-content-center"
                      style={{
                        width: "150px",
                        height: "150px",
                        overflow: "hidden",
                        backgroundColor: "#f8f9fa",
                      }}
                    >
                      {profile.profilePic ? (
                        <img
                          src={profile.profilePic}
                          alt="Profile"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span style={{ color: "#6c757d", fontSize: "14px" }}>
                          No Image
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-9">
                  {/* Personal Info */}
                  <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Personal Information</h5>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label>Employee ID</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.employeeId}
                          readOnly
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          className="form-control"
                          name="dob"
                          value={profile.dob}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Gender</label>
                        <select
                          className="form-control"
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Blood Group</label>
                        <input
                          type="text"
                          className="form-control"
                          name="bloodGroup"
                          value={profile.bloodGroup}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Date of Joining</label>
                        <input
                          type="date"
                          className="form-control"
                          name="joiningDate"
                          value={profile.joiningDate}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Contact Information</h5>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label>Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Emergency Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="emergencyNumber"
                          value={profile.emergencyNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Official Email ID</label>
                        <input
                          type="email"
                          className="form-control"
                          name="officialEmail"
                          value={profile.officialEmail}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label>Personal Email ID</label>
                        <input
                          type="email"
                          className="form-control"
                          name="personalEmail"
                          value={profile.personalEmail}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-12 mb-3">
                        <label>Address</label>
                        <textarea
                          className="form-control"
                          name="address"
                          rows="4"
                          value={profile.address}
                          onChange={handleChange}
                          disabled={!isEditing}
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Employee Info */}
                  <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Employee Details</h5>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label>Role</label>
                        <select
                          className="form-control"
                          name="role"
                          value={profile.role}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Select</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="EMPLOYEE">Employee</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Department</label>
                        <select
                          className="form-control"
                          name="department"
                          value={profile.department}
                          onChange={handleChange}
                          disabled={!isEditing}
                        >
                          <option value="">Select</option>
                      <option value="REGISTRATION TEAM">Registration Team</option>
                      <option value="KEY ACC MANAGEMENT">Key Account Management</option>
                      <option value="GROWTH MANAGEMENT">Growth Management</option>
                      <option value="DIGITAL MARKETING">Digital Marketing</option>
                      <option value="WEB DEVELOPMENT">Web Development</option>
                      <option value="TELE CALLING TEAM">Tele Calling Team</option>
                      <option value="MANAGEMENT">Management</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Designation</label>
                        <input
                          type="text"
                          className="form-control"
                          name="designation"
                          value={profile.designation}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Salary</label>
                        <input
                          type="text"
                          className="form-control"
                          name="salary"
                          value={profile.salary}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="border rounded p-3 mb-4">
                    <h5 className="mb-3">Bank Details</h5>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label>Bank Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="bankName"
                          value={profile.bankName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>Account Number</label>
                        <input
                          type="text"
                          className="form-control"
                          name="accountNumber"
                          value={profile.accountNumber}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label>IFSC Code</label>
                        <input
                          type="text"
                          className="form-control"
                          name="ifscCode"
                          value={profile.ifscCode}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-success me-2"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
