import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./intern.css";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InternProfile from "./InternProfile";
import apiService from "../../services/apiService";
import WeeklyUpdates from "./WeeklyUpdates";

// DashboardContent Component remains the same
function DashboardContent({
  team,
  demos,
  milestones,
  handleSubtaskCheck,
  toggleMilestoneVisibility,
}) {
  // Previous DashboardContent implementation remains unchanged
  return (
    <div className="dash">
      {/* Team Section */}
      <div className="team-section">
        <h2>{team.name}</h2>
        <div className="team-members">
          <div className="team-card">
            <h4>Interns</h4>
            <ul className="member-list">
              {team.members.map((member) => (
                <li key={member._id} className="member-item">
                  <span>{member.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="team-card">
            <h4>Guides</h4>
            <ul className="member-list">
              {team.guides.map((member) => (
                <li key={member._id} className="member-item">
                  <span>{member.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="milestones-section">
        <h3>Milestones:</h3>
        <div className="milestone-scroll-container">
          {milestones.map((milestone) => {
            const allCompleted = milestone.subtasks.every(
              (subtask) => subtask.isCompleted
            );
            return (
              <div
                key={milestone._id}
                className={`milestone ${allCompleted ? "completed" : ""}`}
              >
                <div
                  className="milestone-header"
                  onClick={() => toggleMilestoneVisibility(milestone._id)}
                >
                  <h4 className="milestone-title">
                    {milestone.title}
                    {allCompleted && (
                      <span className="milestone-complete-icon">🏆</span>
                    )}
                  </h4>
                  <div className="milestone-description">
                    <p>{milestone.description}</p>
                  </div>
                </div>
                {milestone.isOpen && (
                  <div className="subtasks">
                    {milestone.subtasks.map((subtask) => (
                      <div key={subtask._id} className="subtask">
                        <span
                          className={`subtask-icon ${
                            subtask.isCompleted ? "completed" : ""
                          }`}
                          onClick={() =>
                            handleSubtaskCheck(
                              milestone._id,
                              subtask._id,
                              !subtask.isCompleted
                            )
                          }
                        >
                          {subtask.isCompleted ? "✅" : "⬜"}
                        </span>
                        <span>{subtask.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Demos Section */}
      <div className="upcoming-demos-section">
        <h3>Upcoming Demos</h3>
        <div id="demos-list">
          {demos.map((demo, index) => (
            <div key={index} className="demo">
              <h4>{demo.Title}</h4>
              <p>
                📅 Date & Time: {new Date(demo.startDateTime).toLocaleString()}{" "}
                - {new Date(demo.endDateTime).toLocaleString()}
              </p>
              <p>📜 Description: {demo.team.project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// InternDashboard Component
function InternDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const [team, setTeam] = useState({
    name: "Loading...",
    members: [],
    guides: [],
  });
  const [teamId, setTeamId] = useState();
  const [demos, setDemos] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [weeklyUpdates, setWeeklyUpdates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await apiService.getProfile();
        const user = userResponse.user;
        if (!user.team) {
          throw new Error("User is not assigned to any team");
        }

        const teamResponse = await apiService.getTeamById(user.team[0]);
        setTeam(teamResponse.data.team);

        const milestonesResponse = await apiService.getMilestonesByTeam(
          user.team[0]
        );
        setTeamId(user.team[0]);
        const milestonesWithOpenState = milestonesResponse.data.milestones.map(
          (milestone) => ({
            ...milestone,
            isOpen: false,
          })
        );
        setMilestones(milestonesWithOpenState);

        const demosResponse = await apiService.getDemosById();
        setDemos(demosResponse.data);

        const weeklyUpdatesResponse = await apiService.fetchWeeklyUpdates(
          user.team[0]
        );
        setWeeklyUpdates(weeklyUpdatesResponse.data.updates);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleSubtaskCheck = async (milestoneId, subtaskId, isCompleted) => {
    try {
      await apiService.updateMilestoneSubtask(
        milestoneId,
        subtaskId,
        isCompleted
      );
      const updatedMilestones = milestones.map((milestone) => {
        if (milestone._id === milestoneId) {
          const updatedSubtasks = milestone.subtasks.map((subtask) => {
            if (subtask._id === subtaskId) {
              return { ...subtask, isCompleted };
            }
            return subtask;
          });
          return { ...milestone, subtasks: updatedSubtasks };
        }
        return milestone;
      });
      setMilestones(updatedMilestones);
    } catch (error) {
      console.error("Error updating subtask:", error);
    }
  };

  const toggleMilestoneVisibility = (milestoneId) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone._id === milestoneId) {
        return { ...milestone, isOpen: !milestone.isOpen };
      }
      return milestone;
    });
    setMilestones(updatedMilestones);
  };

  const handleUpdateClick = (update) => {
    // Implementation remains the same
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/intern/profile");
  };

  const handleDashboardClick = () => {
    navigate("/intern");
  };

  return (
    <div className="intern-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h2 onClick={handleDashboardClick} style={{ cursor: "pointer" }}>
            Intern Dashboard
          </h2>
        </div>
        <div className="header-right">
          <i className="notification-icon">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </i>
          <div className="profile-dropdown-container">
            <i
              className="profile-icon"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <FontAwesomeIcon icon={faUserCircle} size="lg" />
            </i>
            {showDropdown && (
              <div className="profile-dropdown">
                <div onClick={handleProfileClick}>Profile</div>
                <div onClick={handleLogout}>Logout</div>
              </div>
            )}
          </div>
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="tab-navigation">
                <button
                  className={`tab-button ${
                    activeTab === "dashboard" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("dashboard")}
                >
                  Dashboard
                </button>
                <button
                  className={`tab-button ${
                    activeTab === "weekly-updates" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("weekly-updates")}
                >
                  Weekly Updates
                </button>
              </div>
              <div className="content">
                {activeTab === "dashboard" && (
                  <DashboardContent
                    team={team}
                    demos={demos}
                    milestones={milestones}
                    handleSubtaskCheck={handleSubtaskCheck}
                    toggleMilestoneVisibility={toggleMilestoneVisibility}
                  />
                )}
                {activeTab === "weekly-updates" && (
                  <WeeklyUpdates
                    updates={weeklyUpdates}
                    onUpdateClick={handleUpdateClick}
                    teamId={teamId}
                    setWeeklyUpdates={setWeeklyUpdates}
                  />
                )}
              </div>
            </>
          }
        />
        <Route path="profile" element={<InternProfile />} />
      </Routes>
    </div>
  );
}

export default InternDashboard;
