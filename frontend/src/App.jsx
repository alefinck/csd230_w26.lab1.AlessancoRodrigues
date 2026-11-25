import api from './api.js';
import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import AddBookForm from './AddBookForm.jsx';
import BookList from './BookList.jsx';
import MagazineList from './MagazineList.jsx';
import AddMagazineForm from './AddMagazineForm.jsx';
import DiscMagList from './DiscMagList.jsx';
import AddDiscMagForm from './AddDiscMagForm.jsx';
import AuthProvider from './AuthProvider.jsx';
import useAuth from './useAuth.js';
import Login from './Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import DisplayCart from './DisplayCart.jsx';
import './App.css';

export default function App() {
    return (
        <AuthProvider>
            <main className="app-container">
                <h1>My Bookstore Frontend</h1>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="*" element={<SignedInBookApp />} />
                    </Route>
                </Routes>
            </main>
        </AuthProvider>
    );
}

function SignedInBookApp() {
    const { token } = useAuth();
    return <BookApp key={token} />;
}

function BookApp() {
    const { token } = useAuth();
    const isCurrent = () => localStorage.getItem('token') === token;
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [cartLoading, setCartLoading] = useState(true);
    const [cartError, setCartError] = useState('');
    const [cartPending, setCartPending] = useState(false);

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [magazines, setMagazines] = useState([]);
    const [magazinesLoading, setMagazinesLoading] = useState(true);
    const [magazinesError, setMagazinesError] = useState('');

    const [discMags, setDiscMags] = useState([]);
    const [discMagsLoading, setDiscMagsLoading] = useState(true);
    const [discMagsError, setDiscMagsError] = useState('');

    useEffect(() => {
        let active = true;
        api.get('/books')
            .then(response => { if (active && localStorage.getItem('token') === token) setBooks(response.data); })
            .catch(err => { if (active && localStorage.getItem('token') === token) setError(err.message); })
            .finally(() => { if (active && localStorage.getItem('token') === token) setLoading(false); });
        return () => { active = false; };
    }, [token]);

    useEffect(() => {
        let active = true;
        api.get('/magazines')
            .then(response => { if (active && localStorage.getItem('token') === token) setMagazines(response.data); })
            .catch(err => { if (active && localStorage.getItem('token') === token) setMagazinesError(err.message); })
            .finally(() => { if (active && localStorage.getItem('token') === token) setMagazinesLoading(false); });
        return () => { active = false; };
    }, [token]);

    useEffect(() => {
        let active = true;
        api.get('/discmags')
            .then(response => { if (active && localStorage.getItem('token') === token) setDiscMags(response.data); })
            .catch(err => { if (active && localStorage.getItem('token') === token) setDiscMagsError(err.message); })
            .finally(() => { if (active && localStorage.getItem('token') === token) setDiscMagsLoading(false); });
        return () => { active = false; };
    }, [token]);

    useEffect(() => {
        let active = true;
        api.get('/carts/mine')
            .then(response => {
                if (active && localStorage.getItem('token') === token) {
                    setCart(response.status === 204 ? null : response.data);
                }
            })
            .catch(err => {
                if (active && localStorage.getItem('token') === token) setCartError(err.message);
            })
            .finally(() => {
                if (active && localStorage.getItem('token') === token) setCartLoading(false);
            });
        return () => { active = false; };
    }, [token]);

    async function changeCart(productId, remove = false) {
        if (cartLoading || cartPending || !isCurrent()) return;
        setCartError('');
        setCartPending(true);
        try {
            const path = `/carts/mine/products/${productId}`;
            const response = remove ? await api.delete(path) : await api.post(path);
            if (isCurrent()) setCart(response.status === 204 ? null : response.data);
        } catch (err) {
            if (isCurrent()) setCartError(err.message);
        } finally {
            if (isCurrent()) setCartPending(false);
        }
    }

    function handleBookAdded(savedBook) {
        if (!isCurrent()) return;
        setBooks(previous => [...previous, savedBook]);
        navigate('/inventory');
    }

    async function handleDeleteBook(id) {
        if (!window.confirm('Delete this book?')) return;
        setError('');
        try {
            await api.delete(`/books/${id}`);
            if (!isCurrent()) return;
            setBooks(previous => previous.filter(book => book.id !== id));
        } catch (err) { if (isCurrent()) setError(err.message); }
    }

    async function handleUpdateBook(id, data) {
        const response = await api.put(`/books/${id}`, data);
        if (!isCurrent()) return;
        const savedBook = response.data;
        setBooks(previous => previous.map(book => book.id === id ? savedBook : book));
    }

    function handleMagazineAdded(savedMagazine) {
        if (!isCurrent()) return;
        setMagazines(previous => [...previous, savedMagazine]);
    }

    async function handleDeleteMagazine(id) {
        if (!window.confirm('Delete this magazine?')) return;
        setMagazinesError('');
        try {
            await api.delete(`/magazines/${id}`);
            if (!isCurrent()) return;
            setMagazines(previous => previous.filter(mag => mag.id !== id));
        } catch (err) { setMagazinesError(err.message); }
    }

    async function handleUpdateMagazine(id, data) {
        const response = await api.put(`/magazines/${id}`, data);
        if (!isCurrent()) return;
        const savedMagazine = response.data;
        setMagazines(previous => previous.map(mag => mag.id === id ? savedMagazine : mag));
    }

    function handleDiscMagAdded(savedDiscMag) {
        if (!isCurrent()) return;
        setDiscMags(previous => [...previous, savedDiscMag]);
    }

    async function handleDeleteDiscMag(id) {
        if (!window.confirm('Delete this disc magazine?')) return;
        setDiscMagsError('');
        try {
            await api.delete(`/discmags/${id}`);
            if (!isCurrent()) return;
            setDiscMags(previous => previous.filter(dm => dm.id !== id));
        } catch (err) { setDiscMagsError(err.message); }
    }

    async function handleUpdateDiscMag(id, data) {
        const response = await api.put(`/discmags/${id}`, data);
        if (!isCurrent()) return;
        const savedDiscMag = response.data;
        setDiscMags(previous => previous.map(dm => dm.id === id ? savedDiscMag : dm));
    }

    return (
        <>
            <NavBar cartCount={cart?.products?.length ?? 0} />
            {cartError && <p role="status">Cart: {cartError}</p>}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/inventory"
                    element={
                        <BookList
                            books={books}
                            loading={loading}
                            error={error}
                            onDelete={handleDeleteBook}
                            onUpdate={handleUpdateBook}
                            onAddToCart={changeCart}
                            cartPending={cartLoading || cartPending}
                        />
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <DisplayCart
                            cart={cart}
                            loading={cartLoading}
                            error={cartError}
                            pending={cartPending}
                            onRemove={id => changeCart(id, true)}
                        />
                    }
                />
                <Route path="/add" element={<AddBookForm onBookAdded={handleBookAdded} />} />
                <Route
                    path="/magazines"
                    element={
                        <MagazineList
                            magazines={magazines}
                            loading={magazinesLoading}
                            error={magazinesError}
                            onDelete={handleDeleteMagazine}
                            onUpdate={handleUpdateMagazine}
                            onAddToCart={changeCart}
                            cartPending={cartLoading || cartPending}
                        />
                    }
                />
                <Route path="/add-magazine" element={<AddMagazineForm onMagazineAdded={handleMagazineAdded} />} />
                <Route path="/discmags" element={<DiscMagList discMags={discMags} loading={discMagsLoading} error={discMagsError} onDelete={handleDeleteDiscMag} onUpdate={handleUpdateDiscMag} />} />
                <Route path="/add-discmag" element={<AddDiscMagForm onDiscMagAdded={handleDiscMagAdded} />} />
                <Route path="*" element={<h2>Page not found</h2>} />
            </Routes>
        </>
    );
}