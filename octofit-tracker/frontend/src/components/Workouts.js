import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_CODESPACE_NAME
      ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`
      : 'http://localhost:8000/api/workouts/';

    console.log('Workouts API URL:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts fetched data:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4"><p>Loading workouts...</p></div>;
  if (error) return <div className="container mt-4"><p className="text-danger">Error: {error}</p></div>;

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      'Easy': 'success',
      'Medium': 'warning',
      'Hard': 'danger'
    };
    return badges[difficulty] || 'secondary';
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">💪 Workout Routines</h2>
      <div className="row">
        {workouts.map((workout) => (
          <div key={workout.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0 text-center">{workout.name}</h5>
              </div>
              <div className="card-body">
                <p className="card-text text-muted">{workout.description}</p>
                <hr />
                <table className="table table-sm table-borderless mb-0">
                  <tbody>
                    <tr>
                      <td className="fw-bold">Type:</td>
                      <td>{workout.activity_type}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Duration:</td>
                      <td>{workout.duration} minutes</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Points:</td>
                      <td><span className="badge bg-primary">{workout.points}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card-footer bg-white text-center">
                <span className={`badge bg-${getDifficultyBadge(workout.difficulty)} fs-6 px-3 py-2`}>
                  {workout.difficulty}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="alert alert-info mt-3" role="alert">
        <strong>Total workouts:</strong> {workouts.length}
      </div>
    </div>
  );
}

export default Workouts;
