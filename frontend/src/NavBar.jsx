import { Link, useNavigate } from 'react-router';
import useAuth from './useAuth.js';

export default function NavBar({ cartCount }) {
    const { logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/inventory">Books</Link>
            {isAdmin && <Link to="/add">Add Book</Link>}
            <Link to="/magazines">Magazines</Link>
            <Link to="/add-magazine">Add Magazine</Link>
            <Link to="/discmags">Disc Magazines</Link>
            <Link to="/add-discmag">Add Disc Magazine</Link>
            <Link to="/cart">Cart ({cartCount})</Link>
            <button onClick={() => { logout(); navigate('/login', { replace: true }); }}>Logout</button>
        </nav>
    );
}