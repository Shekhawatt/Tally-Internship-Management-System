import React, { useEffect, useState } from "react";
import "./intern.css";

function InternDashboard() {
  const [team, setTeam] = useState({
    name: "Development Team",
    members: [
      { _id: "1", name: "John Doe", role: "Developer" },
      { _id: "2", name: "Jane Smith", role: "Developer" },
    ],
  });

  const [demos, setDemos] = useState([]);
  const demoData = [
    {
      title: "Product Launch",
      date: "Dec 20, 2024 - 10:00 AM",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sit amet libero nisi.",
    },
  ];

  useEffect(() => {
    setDemos(demoData);
  }, []);

  const [milestones, setMilestones] = useState([
    {
      _id: "1",
      title: "Milestone 1",
      description: "First milestone description",
      subtasks: [
        { _id: "1", title: "Subtask 1", isCompleted: false },
        { _id: "2", title: "Subtask 2", isCompleted: false },
      ],
      isOpen: false,
    },
    {
      _id: "2",
      title: "Milestone 2",
      description: "Second milestone description",
      subtasks: [
        { _id: "3", title: "Subtask 1", isCompleted: false },
        { _id: "4", title: "Subtask 2", isCompleted: false },
      ],
      isOpen: false,
    },
    {
      _id: "3",
      title: "Milestone 2",
      description: "Second milestone description",
      subtasks: [
        { _id: "5", title: "Subtask 1", isCompleted: false },
        { _id: "6", title: "Subtask 2", isCompleted: false },
      ],
      isOpen: false,
    },
    {
      _id: "4",
      title: "Milestone 2",
      description: "Second milestone description",
      subtasks: [
        { _id: "7", title: "Subtask 1", isCompleted: false },
        { _id: "8", title: "Subtask 2", isCompleted: false },
      ],
      isOpen: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSubtaskCheck = (milestoneId, subtaskId, isCompleted) => {
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

  return (
    <div className="intern-dashboard">
      <div className="navbar">
        <div className="navbar-left">
          <span className="navbar-title">INTERN DASHBOARD</span>
        </div>
        <div className="navbar-right">
          <button className="navbar-button">Notifications</button>
          <button className="navbar-button">Profile</button>
        </div>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "dashboard" ? "active" : ""}`}
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
          <div className="dash">
            <div className="team-section">
              <h2>{team.name}</h2>
              <h4>Members:</h4>
              <ul>
                {team.members.map((member) => (
                  <li key={member._id}>
                    {member.name} - {member.role}
                  </li>
                ))}
              </ul>
            </div>

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

            <div className="upcoming-demos-section">
              <h3>Upcoming Demos</h3>
              <div id="demos-list">
                {demos.map((demo, index) => (
                  <div key={index} className="demo">
                    <div className="demo-header">
                      <h4>{demo.title}</h4>
                      <p>{demo.date}</p>
                    </div>
                    <p>{demo.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "weekly-updates" && (
          <div className="weekly-updates-section">
            <h3>Weekly Updates</h3>
            <p>Content for weekly updates will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InternDashboard;
