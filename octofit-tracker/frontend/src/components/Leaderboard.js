import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
      : 'http://localhost:8000/api/leaderboard/';

    console.log('Leaderboard API URL:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  // Separate users and teams, and sort by rank/points
  const users = leaderboard
    .filter(entry => entry.entity_type === 'user')
    .sort((a, b) => a.rank - b.rank || b.total_points - a.total_points);
  
  const teams = leaderboard
    .filter(entry => entry.entity_type === 'team')
    .sort((a, b) => a.rank - b.rank || b.total_points - a.total_points);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🏆 Leaderboard</h2>
      
      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">👤 User Rankings</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{width: '80px'}}>Rank</th>
                      <th scope="col">Name</th>
                      <th scope="col" className="text-end">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((entry) => (
                      <tr key={entry.id} className={entry.rank <= 3 ? 'table-warning' : ''}>
                        <td className="fw-bold">
                          {entry.rank === 1 && '🥇 '}
                          {entry.rank === 2 && '🥈 '}
                          {entry.rank === 3 && '🥉 '}
                          {entry.rank > 3 && `#${entry.rank}`}
                        </td>
                        <td><strong>{entry.entity_name}</strong></td>
                        <td className="text-end">
                          <span className="badge bg-success fs-6">{entry.total_points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
              <h4 className="mb-0">👥 Team Rankings</h4>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">Team</th>
                      <th scope="col" className="text-end">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((entry) => (
                      <tr key={entry.id} className={entry.rank === 1 ? 'table-warning' : ''}>
                        <td>
                          {entry.rank === 1 && '🏆 '}
                          <strong>{entry.entity_name}</strong>
                        </td>
                        <td className="text-end">
                          <span className="badge bg-primary fs-6">{entry.total_points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
