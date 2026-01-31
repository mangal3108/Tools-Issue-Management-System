import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [view, setView] = useState('login'); // login, admin, mechanic
  const [formData, setFormData] = useState({});

  const handleLogin = (role) => {
    // Shortcuts for the demo
    setView(role); 
  };

  const registerMechanic = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register-mechanic', formData);
      alert("Mechanic Registered Successfully!");
    } catch (err) {
      alert(err.response.data.msg || "Error");
    }
  };

  if (view === 'login') {
    return (
      <div className="container mt-5 text-center">
        <h2>Tools Issue Management System</h2>
        <div className="mt-4">
          <button className="btn btn-primary m-2" onClick={() => handleLogin('admin')}>Login as Admin</button>
          <button className="btn btn-secondary m-2" onClick={() => handleLogin('mechanic')}>Login as Mechanic</button>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-between">
          <h2>Admin Dashboard</h2>
          <button className="btn btn-danger" onClick={() => setView('login')}>Logout</button>
        </div>
        
        <div className="row mt-4">
          {/* Section B.1 & B.2: Register Mechanic */}
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h5>Register New Mechanic</h5>
              <form onSubmit={registerMechanic}>
                <input type="text" placeholder="Name" className="form-control mb-2" onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="email" placeholder="Email (Unique)" className="form-control mb-2" onChange={e => setFormData({...formData, email: e.target.value})} required />
                <input type="text" placeholder="Mobile (10 digits)" className="form-control mb-2" onChange={e => setFormData({...formData, mobile: e.target.value})} required />
                <input type="password" placeholder="Password (Alpha + Special)" className="form-control mb-2" onChange={e => setFormData({...formData, password: e.target.value})} required />
                <select className="form-control mb-2" onChange={e => setFormData({...formData, level: e.target.value})}>
                  <option>Select Level</option>
                  <option>Expert</option><option>Medium</option><option>New Recruit</option><option>Trainee</option>
                </select>
                <button className="btn btn-success w-100">Add Mechanic</button>
              </form>
            </div>
          </div>

          {/* Section B.3: Add Tools */}
          <div className="col-md-6">
            <div className="card p-3 shadow-sm">
              <h5>Add Tools to Inventory</h5>
              <form>
                <input type="text" placeholder="Tool Title" className="form-control mb-2" />
                <input type="text" placeholder="Category (e.g. Hammer)" className="form-control mb-2" />
                <input type="number" placeholder="Quantity" className="form-control mb-2" />
                <button className="btn btn-info w-100">Add Tool</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Mechanic Panel Coming Soon...</div>;
}

export default App;