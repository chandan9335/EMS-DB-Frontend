import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const API_URL = "http://localhost:4000/employees";

  // FETCH EMPLOYEES

  const getEmployees = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // HANDLE INPUT

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      salary: "",
    });
    setEditingId(null);
  };

  // ADD / UPDATE EMPLOYEE

  const saveEmployee = async (e) => {
    e.preventDefault();

    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      //headers are the extra information sent with the request. Here with label we sent json data
      body: JSON.stringify(formData),
      // The body contains the actual data being sent.
    });

    resetForm();
    getEmployees();
  };

  // EDIT EMPLOYEE

  const editEmployee = (employee) => {
    setEditingId(employee.id);
    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // DELETE EMPLOYEE

  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (editingId === id) {
      resetForm();
    }

    getEmployees();
  };

  const departments = [
    "All",
    ...new Set(employees.map((employee) => employee.department).filter(Boolean)),
  ];

  const filteredEmployees = employees.filter((employee) => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch =
      employee.name.toLowerCase().includes(searchText) ||
      employee.department.toLowerCase().includes(searchText);

    const matchesDepartment =
      departmentFilter === "All" || employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      <div className="stats">
        <div>
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>
        <div>
          <span>Showing</span>
          <strong>{filteredEmployees.length}</strong>
        </div>
      </div>

      <form onSubmit={saveEmployee} className="form">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId ? "Update Employee" : "Add Employee"}
        </button>

        {editingId && (
          <button type="button" className="cancel-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <div className="filters">
        <input
          type="search"
          placeholder="Search employee"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          {departments.map((department) => (
            <option key={department} value={department}>
              {department === "All" ? "All Departments" : department}
            </option>
          ))}
        </select>
      </div>

      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="card">
            <h3>{employee.name}</h3>

            <p>Department: {employee.department}</p>

            <p>Salary: Rs. {employee.salary}</p>

            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => editEmployee(employee)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteEmployee(employee.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <p className="empty-message">No employees found.</p>
      )}
    </div>
  );
}

export default App;
