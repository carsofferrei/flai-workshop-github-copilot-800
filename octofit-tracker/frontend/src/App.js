import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <strong>🏋️ OctoFit Tracker</strong>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

// Home component
function Home() {
  return (
    <div className="container mt-4">
      <div className="jumbotron text-center">
        <h1 className="display-3">Welcome to OctoFit Tracker! 🏋️‍♂️</h1>
        <p className="lead mt-4 fs-5">
          Track your fitness journey with your favorite superheroes from <strong>Team Marvel</strong> and <strong>Team DC</strong>!
        </p>
        <hr className="my-4" style={{borderTop: '3px solid white'}} />
        <p className="fs-6">
          View the leaderboard, explore teams, check out users, track activities, and discover workout routines.
        </p>
        <div className="mt-4">
          <Link to="/leaderboard" className="btn btn-light btn-lg m-2 shadow">
            🏆 View Leaderboard
          </Link>
          <Link to="/teams" className="btn btn-light btn-lg m-2 shadow">
            👥 Explore Teams
          </Link>
        </div>
      </div>

      <div className="row mt-4 g-4">
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body text-center">
              <div className="mb-3">
                <span className="display-4">📊</span>
              </div>
              <h5 className="card-title">Track Activities</h5>
              <p className="card-text text-muted">Monitor all fitness activities and earn points for your team</p>
              <Link to="/activities" className="btn btn-outline-primary">View Activities</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body text-center">
              <div className="mb-3">
                <span className="display-4">💪</span>
              </div>
              <h5 className="card-title">Workout Plans</h5>
              <p className="card-text text-muted">Discover superhero-inspired workout routines and challenges</p>
              <Link to="/workouts" className="btn btn-outline-success">View Workouts</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body text-center">
              <div className="mb-3">
                <span className="display-4">👤</span>
              </div>
              <h5 className="card-title">Users</h5>
              <p className="card-text text-muted">See all registered superhero fitness enthusiasts</p>
              <Link to="/users" className="btn btn-outline-info">View Users</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
