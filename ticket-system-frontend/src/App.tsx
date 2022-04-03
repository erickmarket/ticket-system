import { useContext } from 'react';
import { Link, Outlet} from 'react-router-dom';
import { AuthContext } from './contexts/AuthProvider';
import "./App.css";

function App() {

  const {user, isLoggedIn } = useContext(AuthContext); 

  return (
    <div className="container mt-5">
      <nav className="navbar justify-content-center">
        {isLoggedIn && user.is_staff === false 
        ? <Link className="text-white mx-2" to="/submit-ticket">Submit Ticket</Link>
        : null}
        <Link className="text-white mx-2" to="/ticket-list">Ticket List</Link>
        {isLoggedIn 
        ? <Link className="text-white mx-2" to="/logout">Logout ({user.username})</Link>
        : <Link className="text-white mx-2" to="/login">Login</Link>}
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
