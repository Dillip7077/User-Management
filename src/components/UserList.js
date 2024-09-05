import React, { useState, useEffect } from 'react'; // Import React hooks
import axios from 'axios'; // Import axios for HTTP requests
import './UserList.css'; // Import CSS for styling

function UserList() {
  const [users, setUsers] = useState([]); // State to store users
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' }); // State for form data
  const [editMode, setEditMode] = useState(false); // State for edit mode
  const [editUserId, setEditUserId] = useState(null); // State for user ID being edited

  useEffect(() => {
    // Fetch users from API on component mount
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []); // Empty dependency array ensures this runs only once

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value }); // Update form data
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (editMode) {
      // Update existing user
      axios.put(`https://jsonplaceholder.typicode.com/users/${editUserId}`, formData)
        .then(() => {
          setUsers(users.map(user => (user.id === editUserId ? { ...user, ...formData } : user)));
          setEditMode(false);
          setFormData({ name: '', email: '', phone: '' });
          setEditUserId(null);
        })
        .catch(error => console.error('Error updating user:', error));
    } else {
      // Add new user
      axios.post('https://jsonplaceholder.typicode.com/users', formData)
        .then(response => {
          setUsers([...users, { ...response.data, id: users.length + 1 }]);
          setFormData({ name: '', email: '', phone: '' });
        })
        .catch(error => console.error('Error creating user:', error));
    }
  };

  const handleEdit = (user) => {
    setEditMode(true);
    setEditUserId(user.id);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
  };

  const handleDelete = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => setUsers(users.filter(user => user.id !== id)))
      .catch(error => console.error('Error deleting user:', error));
  };

  return (
    <div>
      <h1><span>User List</span></h1>

      {/* Form for creating,editing & deleting a user */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          className="input"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          className="input"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="input"
          required
        />
        <button type="submit" className="submitButton">
          {editMode ? 'Update User' : 'Add User'}
        </button>
      </form>

      {/* Table to display users */}
      <table className="table">
        <thead>
          <tr>
            <th className="th">Name</th>
            <th className="th">Email</th>
            <th className="th">Phone</th>
            <th className="th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="td">{user.name}</td>
              <td className="td">{user.email}</td>
              <td className="td">{user.phone}</td>
              <td>
                <button 
                  onClick={() => handleEdit(user)} 
                  className="modifyButton">
                  Modify
                </button>
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="deleteButton">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;
