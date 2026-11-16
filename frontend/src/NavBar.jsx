import { Link } from 'react-router';

export default function NavBar() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/inventory">Books</Link>
            <Link to="/add">Add Book</Link>
            <Link to="/magazines">Magazines</Link>
            <Link to="/add-magazine">Add Magazine</Link>
            <Link to="/discmags">Disc Magazines</Link>
            <Link to="/add-discmag">Add Disc Magazine</Link>
        </nav>
    );
}