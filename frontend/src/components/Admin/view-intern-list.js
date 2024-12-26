// ViewInternList.js
import React, { useState, useEffect } from "react";

const ViewInternList = () => {
  const [internList, setInternList] = useState([]);

  useEffect(() => {
    // Fetch list of interns from the backend (mocked for now)
    setInternList([
      { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@example.com",
        status: "Inactive",
      },
    ]);
  }, []);

  return (
    <div>
      <h3>Intern List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {internList.map((intern) => (
            <tr key={intern.id}>
              <td>{intern.name}</td>
              <td>{intern.email}</td>
              <td>{intern.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewInternList;
