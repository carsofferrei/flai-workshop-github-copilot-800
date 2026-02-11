import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const baseUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
      : 'http://localhost:8000/api';

    console.log('Activities API Base URL:', baseUrl);

    // Fetch all data in parallel
    Promise.all([
      fetch(`${baseUrl}/activities/`).then(res => res.json()),
      fetch(`${baseUrl}/users/`).then(res => res.json()),
      fetch(`${baseUrl}/teams/`).then(res => res.json())
    ])
      .then(([activitiesData, usersData, teamsData]) => {
        console.log('Activities fetched data:', activitiesData);
        console.log('Users fetched data:', usersData);
        console.log('Teams fetched data:', teamsData);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesArray = activitiesData.results || activitiesData;
        const usersArray = usersData.results || usersData;
        const teamsArray = teamsData.results || teamsData;
        
        setActivities(activitiesArray);
        setUsers(usersArray);
        setTeams(teamsArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading activities...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Create lookup maps for users and teams
  const userMap = {};
  users.forEach(user => {
    userMap[user.id] = user;
  });

  const teamMap = {};
  teams.forEach(team => {
    teamMap[team.id] = team;
  });

  // Helper function to get user name
  const getUserName = (userId) => {
    return userMap[userId]?.name || 'Unknown User';
  };

  // Helper function to get team name
  const getTeamName = (userId) => {
    const user = userMap[userId];
    if (user && user.team_id) {
      return teamMap[user.team_id]?.name || 'No Team';
    }
    return 'No Team';
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Activities</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th scope="col">User</th>
              <th scope="col">Team</th>
              <th scope="col">Activity Type</th>
              <th scope="col">Duration (min)</th>
              <th scope="col" className="text-center">Points</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td><strong className="text-primary">{getUserName(activity.user_id)}</strong></td>
                <td>
                  <span className={`badge ${getTeamName(activity.user_id).includes('Marvel') ? 'bg-danger' : 'bg-info'}`}>
                    {getTeamName(activity.user_id)}
                  </span>
                </td>
                <td><strong>{activity.activity_type}</strong></td>
                <td>{activity.duration} min</td>
                <td className="text-center">
                  <span className="badge bg-primary">{activity.points}</span>
                </td>
                <td>{formatDate(activity.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="alert alert-info mt-3" role="alert">
        <strong>Total activities:</strong> {activities.length}
      </div>
    </div>
  );
}

export default Activities;
