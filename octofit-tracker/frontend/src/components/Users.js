import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    team_id: ''
  });

  const baseUrl = process.env.REACT_APP_CODESPACE_NAME
    ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
    : 'http://localhost:8000/api';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Fetch both users and teams
    Promise.all([
      fetch(`${baseUrl}/users/`).then(res => res.json()),
      fetch(`${baseUrl}/teams/`).then(res => res.json())
    ])
      .then(([usersData, teamsData]) => {
        console.log('Users fetched data:', usersData);
        console.log('Teams fetched data:', teamsData);
        
        const usersArray = usersData.results || usersData;
        const teamsArray = teamsData.results || teamsData;
        
        // Sort users by total_points in descending order
        const sortedUsers = usersArray.sort((a, b) => b.total_points - a.total_points);
        
        setUsers(sortedUsers);
        setTeams(teamsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      team_id: user.team_id || ''
    });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', team_id: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editingUser) return;

    console.log('Updating user:', editingUser.id, 'with data:', formData);

    fetch(`${baseUrl}/users/${editingUser.id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        team_id: formData.team_id,
        total_points: editingUser.total_points // Keep existing points
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('User updated successfully:', data);
        handleClose();
        fetchData(); // Refresh the data
        alert('User updated successfully!');
      })
      .catch(error => {
        console.error('Error updating user:', error);
        alert(`Error updating user: ${error.message}`);
      });
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'No Team';
  };

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div className="container mt-4"><p>Loading users...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👤 Users</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Team</th>
              <th scope="col" className="text-center">Total Points</th>
              <th scope="col">Joined</th>
              <th scope="col" className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td><strong className="text-primary">{user.name}</strong></td>
                <td><code className="text-secondary">{user.email ? user.email.split('@')[0] : 'N/A'}</code></td>
                <td><small className="text-muted">{user.email}</small></td>
                <td>
                  <span className={`badge ${getTeamName(user.team_id).includes('Marvel') ? 'bg-danger' : 'bg-info'}`}>
                    {getTeamName(user.team_id)}
                  </span>
                </td>
                <td className="text-center">
                  <span className="badge bg-success fs-6">{user.total_points}</span>
                </td>
                <td>{formatDate(user.created_at)}</td>
                <td className="text-center">
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEdit(user)}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="alert alert-info mt-3" role="alert">
        <strong>Total users:</strong> {users.length}
      </div>

      {/* Edit User Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Edit User Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-bold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="team_id" className="form-label fw-bold">Team</label>
                    <select
                      className="form-select"
                      id="team_id"
                      name="team_id"
                      value={formData.team_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a team...</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="alert alert-warning" role="alert">
                    <small><strong>Note:</strong> Total points cannot be modified and will remain at {editingUser?.total_points}.</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    💾 Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
