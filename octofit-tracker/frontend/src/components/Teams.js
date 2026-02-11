import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
      : 'http://localhost:8000/api/teams/';

    console.log('Teams API URL:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        
        // Sort teams by total_points in descending order
        const sortedTeams = teamsData.sort((a, b) => b.total_points - a.total_points);
        
        setTeams(sortedTeams);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Format date as DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) return <div className="container mt-4"><p>Loading teams...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👥 Teams</h2>
      <div className="row">
        {teams.map((team) => (
          <div key={team.id} className="col-md-6 mb-4">
            <div className="card shadow-sm h-100">
              <div className="card-header bg-gradient text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                <h5 className="card-title mb-0">{team.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text text-muted">{team.description}</p>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">Total Points</small>
                    <span className="badge bg-primary fs-5">{team.total_points}</span>
                  </div>
                  <div className="text-end">
                    <small className="text-muted d-block">Created</small>
                    <small><strong>{formatDate(team.created_at)}</strong></small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="alert alert-info mt-3" role="alert">
        <strong>Total teams:</strong> {teams.length}
      </div>
    </div>
  );
}

export default Teams;
