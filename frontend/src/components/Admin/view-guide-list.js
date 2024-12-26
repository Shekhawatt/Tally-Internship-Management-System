// ViewGuideList.js
import React, { useState, useEffect } from "react";

const ViewGuideList = () => {
  const [guideList, setGuideList] = useState([]);

  useEffect(() => {
    // Fetch list of guides from the backend (mocked for now)
    setGuideList([
      {
        id: 1,
        name: "Dr. Smith",
        email: "smith@example.com",
        department: "Computer Science",
      },
      {
        id: 2,
        name: "Prof. Brown",
        email: "brown@example.com",
        department: "Electrical Engineering",
      },
    ]);
  }, []);

  return (
    <div>
      <h3>Guide List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {guideList.map((guide) => (
            <tr key={guide.id}>
              <td>{guide.name}</td>
              <td>{guide.email}</td>
              <td>{guide.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewGuideList;
