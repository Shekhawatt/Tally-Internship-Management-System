import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./guide.css";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GuideProfile from "./GuideProfile";
import apiService from "../../services/apiService";
import WeeklyUpdates from "./WeeklyUpdates";

// TeamContent Component to display team members and guides
function TeamContent({ teams, activeTeam, onTeamSelect }) {
  return (
    <div className="teams-section">
      <h2 className="teams-heading">Teams</h2>
      <div className="teams-container">
        {teams.map((team) => (
          <div
            key={team._id}
            className={`team-card ${
              activeTeam._id === team._id ? "active" : ""
            }`}
            onClick={() => onTeamSelect(team)}
          >
            <div
              className={`team-header ${
                activeTeam._id === team._id ? "active-header" : ""
              }`}
            >
              <h3>{team.name}</h3>
            </div>

            {activeTeam._id === team._id && (
              <div className="team-details">
                <div className="team-detail-card">
                  <h4>Interns</h4>
                  <ul className="member-list">
                    {team.members.map((member) => (
                      <li key={member._id} className="member-item">
                        <span>{member.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="team-detail-card">
                  <h4>Guides</h4>
                  <ul className="member-list">
                    {team.guides.map((guide) => (
                      <li key={guide._id} className="member-item">
                        <span>{guide.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// DashboardContent Component
function DashboardContent({
  teams,
  activeTeam,
  demos,
  milestones,
  setMilestones,
  handleSubtaskCheck,
  toggleMilestoneVisibility,
  onTeamSelect,
  handleAddSubtask,
}) {
  // State to handle the visibility of the input field and description value
  const [isSubtaskInputVisible, setIsSubtaskInputVisible] = useState({});
  const [subtaskDescription, setSubtaskDescription] = useState({});

  // Function to toggle the visibility of the subtask input
  const handleToggleSubtaskInput = (milestoneId) => {
    setIsSubtaskInputVisible((prev) => ({
      ...prev,
      [milestoneId]: !prev[milestoneId],
    }));
  };

  // Function to handle the change in the input field
  const handleInputChange = (e, milestoneId) => {
    setSubtaskDescription((prev) => ({
      ...prev,
      [milestoneId]: e.target.value,
    }));
  };

  // Function to add a subtask with the description
  const handleAddSubtaskWithDescription = async (milestoneId) => {
    try {
      const description = subtaskDescription[milestoneId];
      if (!description) return; // Don't add if the description is empty

      // Call the backend to add the new subtask
      const response = await apiService.addSubtask(milestoneId, {
        description,
      });

      // Add the new subtask to the milestone
      const updatedMilestones = milestones.map((milestone) => {
        if (milestone._id === milestoneId) {
          return {
            ...milestone,
            subtasks: [
              ...milestone.subtasks,
              {
                _id: response.data.subtask._id,
                title: description,
                isCompleted: false,
              },
            ],
          };
        }
        return milestone;
      });

      setMilestones(updatedMilestones);

      // Clear the input and hide it
      setSubtaskDescription((prev) => ({
        ...prev,
        [milestoneId]: "",
      }));
      setIsSubtaskInputVisible((prev) => ({
        ...prev,
        [milestoneId]: false,
      }));
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  return (
    <div className="dash">
      {/* Teams Section */}
      <TeamContent
        teams={teams}
        activeTeam={activeTeam}
        onTeamSelect={onTeamSelect}
      />

      {/* Milestones Section */}
      <div className="milestones-section">
        <h3>Milestones for {activeTeam.name}:</h3>
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
                    <button
                      onClick={() => handleToggleSubtaskInput(milestone._id)}
                      className="add-subtask-btn"
                    >
                      Add Subtask
                    </button>

                    {/* Conditional input field for new subtask */}
                    {isSubtaskInputVisible[milestone._id] && (
                      <div className="subtask-input">
                        <input
                          type="text"
                          value={subtaskDescription[milestone._id] || ""}
                          onChange={(e) => handleInputChange(e, milestone._id)}
                          placeholder="Enter subtask description"
                        />
                        <button
                          onClick={() =>
                            handleAddSubtaskWithDescription(milestone._id)
                          }
                          className="add-subtask-btn"
                        >
                          Add Subtask
                        </button>
                      </div>
                    )}
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

// GuideDashboard Component
function GuideDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [demos, setDemos] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [weeklyUpdates, setWeeklyUpdates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch guide's profile to get associated teams
        const userResponse = await apiService.getProfile();
        const guide = userResponse.user;
        if (!guide.team || guide.team.length === 0) {
          throw new Error("Guide is not assigned to any teams");
        }
        // Fetch all teams' details
        const teamsData = await Promise.all(
          guide.team.map((teamId) => apiService.getTeamById(teamId))
        );
        const fetchedTeams = teamsData.map((response) => response.data.team);
        setTeams(fetchedTeams);

        // Set first team as active by default
        setActiveTeam(fetchedTeams[0]);
        await fetchTeamData(fetchedTeams[0]._id);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const fetchTeamData = async (teamId) => {
    try {
      // Fetch milestones for the selected team
      const milestonesResponse = await apiService.getMilestonesByTeam(teamId);
      const milestonesWithOpenState = milestonesResponse.data.milestones.map(
        (milestone) => ({
          ...milestone,
          isOpen: false,
        })
      );
      setMilestones(milestonesWithOpenState);

      // Fetch demos for the selected team
      const demosResponse = await apiService.getDemosById();
      setDemos(demosResponse.data);

      // Fetch weekly updates for the selected team
      const weeklyUpdatesResponse = await apiService.fetchWeeklyUpdates(teamId);
      setWeeklyUpdates(weeklyUpdatesResponse.data.updates);
      console.log(teamId);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleTeamSelect = async (team) => {
    setActiveTeam(team);
    await fetchTeamData(team._id);
  };

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

  const handleAddSubtask = async (milestoneId) => {
    try {
      // Call the backend to add a new subtask
      const response = await apiService.addSubtask(milestoneId);
      // Add the new subtask to the milestone
      const updatedMilestones = milestones.map((milestone) => {
        if (milestone._id === milestoneId) {
          return {
            ...milestone,
            subtasks: [...milestone.subtasks, response.data.subtask],
          };
        }
        return milestone;
      });
      setMilestones(updatedMilestones);
    } catch (error) {
      console.error("Error adding subtask:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/guide/profile");
  };

  const handleDashboardClick = () => {
    navigate("/guide");
  };

  if (!activeTeam) {
    return <div>Loading...</div>;
  }

  return (
    <div className="guide-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h2 onClick={handleDashboardClick} style={{ cursor: "pointer" }}>
            Guide Dashboard
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
              {activeTab === "dashboard" ? (
                <DashboardContent
                  teams={teams}
                  activeTeam={activeTeam}
                  demos={demos}
                  milestones={milestones}
                  handleSubtaskCheck={handleSubtaskCheck}
                  toggleMilestoneVisibility={toggleMilestoneVisibility}
                  onTeamSelect={handleTeamSelect}
                  handleAddSubtask={handleAddSubtask}
                  setMilestones={setMilestones}
                />
              ) : (
                <WeeklyUpdates updates={weeklyUpdates} />
              )}
            </>
          }
        />
        <Route path="/profile" element={<GuideProfile />} />
      </Routes>
    </div>
  );
}

export default GuideDashboard;
