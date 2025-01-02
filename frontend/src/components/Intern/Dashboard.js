import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./intern.css";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InternProfile from "./InternProfile";
import apiService from "../../services/apiService";

// DashboardContent Component
function DashboardContent({
  team,
  demos,
  milestones,
  handleSubtaskCheck,
  toggleMilestoneVisibility,
}) {
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
                  <h4>{milestone.title}</h4>
                  <p>{milestone.description}</p>
                </div>
                {milestone.isOpen && (
                  <div className="subtasks">
                    {milestone.subtasks.map((subtask) => (
                      <div key={subtask._id} className="subtask">
                        <input
                          type="checkbox"
                          checked={subtask.isCompleted}
                          onChange={() =>
                            handleSubtaskCheck(
                              milestone._id,
                              subtask._id,
                              !subtask.isCompleted
                            )
                          }
                        />
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
  const [team, setTeam] = useState({
    name: "Loading...",
    members: [],
    guides: [],
  });
  const [demos, setDemos] = useState([]);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching user profile to get the team ID
        const userResponse = await apiService.getProfile();
        const user = userResponse.user;
        if (!user.team) {
          throw new Error("User is not assigned to any team");
        }

        // Fetch team details using the team ID from user profile
        const teamResponse = await apiService.getTeamById(user.team[0]);
        setTeam(teamResponse.data.team);

        // Fetch milestones for the team
        const milestonesResponse = await apiService.getMilestonesByTeam(
          user.team[0]
        );
        const milestonesWithOpenState = milestonesResponse.data.milestones.map(
          (milestone) => ({
            ...milestone,
            isOpen: false,
          })
        );
        setMilestones(milestonesWithOpenState);

        const demosResponse = await apiService.getDemosById();
        console.log(demosResponse);
        setDemos(demosResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Handling subtask completion
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

  // Toggling milestone visibility
  const toggleMilestoneVisibility = (milestoneId) => {
    const updatedMilestones = milestones.map((milestone) => {
      if (milestone._id === milestoneId) {
        return { ...milestone, isOpen: !milestone.isOpen };
      }
      return milestone;
    });
    setMilestones(updatedMilestones);
  };

  return (
    <div className="intern-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h2>Intern Dashboard</h2>
        </div>
        <div className="header-right">
          <i className="notification-icon">
            <FontAwesomeIcon icon={faBell} size="lg" />
          </i>
          <i className="profile-icon" onClick={() => navigate("profile")}>
            <FontAwesomeIcon icon={faUserCircle} size="lg" />
          </i>
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
                  <div className="weekly-updates-section">
                    <h3>Weekly Updates</h3>
                    <p>Content for weekly updates will be displayed here.</p>
                  </div>
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
