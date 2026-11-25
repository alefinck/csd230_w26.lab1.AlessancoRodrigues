import api from './api.js';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import NavBar from './NavBar.jsx';
import Home from './Home.jsx';
import AddBookForm from './AddBookForm.jsx';
import BookList from './BookList.jsx';
import MagazineList from './MagazineList.jsx';
import AddMagazineForm from './AddMagazineForm.jsx';
import DiscMagList from './DiscMagList.jsx';
import AddDiscMagForm from './AddDiscMagForm.jsx';
import './App.css';

export default function App() {
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
            .then(response => { if (active) setBooks(response.data); })
            .catch(err => { if (active) setError(err.message); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        let active = true;
        fetch('/api/rest/magazines')
            .then(res => {
                if (!res.ok) throw new Error(`Load failed (${res.status})`);
                return res.json();
            })
            .then(data => { if (active) setMagazines(data); })
            .catch(err => { if (active) setMagazinesError(err.message); })
            .finally(() => { if (active) setMagazinesLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        let active = true;
        fetch('/api/rest/discmags')
            .then(res => {
                if (!res.ok) throw new Error(`Load failed (${res.status})`);
                return res.json();
            })
            .then(data => { if (active) setDiscMags(data); })
            .catch(err => { if (active) setDiscMagsError(err.message); })
            .finally(() => { if (active) setDiscMagsLoading(false); });
        return () => { active = false; };
    }, []);

    function handleBookAdded(savedBook) {
        setBooks(previous => [...previous, savedBook]);
    }

    async function handleDeleteBook(id) {
        if (!window.confirm('Delete this book?')) return;
        setError('');
        try {
            await api.delete(`/books/${id}`);
            setBooks(previous => previous.filter(book => book.id !== id));
        } catch (err) { setError(err.message); }
    }

    async function handleUpdateBook(id, data) {
        const response = await api.put(`/books/${id}`, data);
        const savedBook = response.data;
        setBooks(previous => previous.map(book => book.id === id ? savedBook : book));
    }

    function handleMagazineAdded(savedMagazine) {
        setMagazines(previous => [...previous, savedMagazine]);
    }

    async function handleDeleteMagazine(id) {
        if (!window.confirm('Delete this magazine?')) return;
        setMagazinesError('');
        try {
            const response = await fetch(`/api/rest/magazines/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Delete failed (${response.status})`);
            setMagazines(previous => previous.filter(mag => mag.id !== id));
        } catch (err) { setMagazinesError(err.message); }
    }

    async function handleUpdateMagazine(id, data) {
        const response = await fetch(`/api/rest/magazines/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Update failed (${response.status})`);
        const savedMagazine = await response.json();
        setMagazines(previous => previous.map(mag => mag.id === id ? savedMagazine : mag));
    }

    function handleDiscMagAdded(savedDiscMag) {
        setDiscMags(previous => [...previous, savedDiscMag]);
    }

    async function handleDeleteDiscMag(id) {
        if (!window.confirm('Delete this disc magazine?')) return;
        setDiscMagsError('');
        try {
            const response = await fetch(`/api/rest/discmags/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error(`Delete failed (${response.status})`);
            setDiscMags(previous => previous.filter(dm => dm.id !== id));
        } catch (err) { setDiscMagsError(err.message); }
    }

    async function handleUpdateDiscMag(id, data) {
        const response = await fetch(`/api/rest/discmags/${id}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Update failed (${response.status})`);
        const savedDiscMag = await response.json();
        setDiscMags(previous => previous.map(dm => dm.id === id ? savedDiscMag : dm));
    }

    return (
        <main className="app-container">
            <h1>My Bookstore Frontend</h1>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<BookList books={books} loading={loading} error={error} onDelete={handleDeleteBook} onUpdate={handleUpdateBook} />} />
                <Route path="/add" element={<AddBookForm onBookAdded={handleBookAdded} />} />
                <Route path="/magazines" element={<MagazineList magazines={magazines} loading={magazinesLoading} error={magazinesError} onDelete={handleDeleteMagazine} onUpdate={handleUpdateMagazine} />} />
                <Route path="/add-magazine" element={<AddMagazineForm onMagazineAdded={handleMagazineAdded} />} />
                <Route path="/discmags" element={<DiscMagList discMags={discMags} loading={discMagsLoading} error={discMagsError} onDelete={handleDeleteDiscMag} onUpdate={handleUpdateDiscMag} />} />
                <Route path="/add-discmag" element={<AddDiscMagForm onDiscMagAdded={handleDiscMagAdded} />} />
            </Routes>
        </main>
    );
}