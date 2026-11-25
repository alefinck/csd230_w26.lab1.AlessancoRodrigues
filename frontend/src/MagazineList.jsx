import useAuth from './useAuth.js';
import api from './api.js';
import { useState, useEffect } from 'react';
import AddMagazineForm from './AddMagazineForm.jsx';
import Magazine from './Magazine.jsx';

export default function MagazineList({ onAddToCart, cartPending }) {
    const { token, isAdmin } = useAuth();
    const isCurrent = () => localStorage.getItem('token') === token;
    const [magazines, setMagazines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        api.get('/magazines')
            .then(response => { if (active && localStorage.getItem('token') === token) setMagazines(response.data); })
            .catch(err => { if (active && localStorage.getItem('token') === token) setError(err.message); })
            .finally(() => { if (active && localStorage.getItem('token') === token) setLoading(false); });
        return () => { active = false; };
    }, [token]);

    async function handleDeleteMagazine(id) {
        if (!window.confirm('Delete this magazine?')) return;
        setError('');
        try {
            await api.delete(`/magazines/${id}`);
            if (!isCurrent()) return;
            setMagazines(previous => previous.filter(magazine => magazine.id !== id));
        } catch (err) { if (isCurrent()) setError(err.message); }
    }

    async function handleUpdateMagazine(id, data) {
        const res = await api.put(`/magazines/${id}`, data);
        if (!isCurrent()) return;
        const saved = res.data;
        setMagazines(previous => previous.map(magazine => magazine.id === id ? saved : magazine));
    }

    if (loading) return <p>Loading magazines...</p>;

    return (
        <section aria-label="Magazine inventory">
            <h2>Magazines</h2>
            {isAdmin && <AddMagazineForm onMagazineAdded={saved => { if (isCurrent()) setMagazines(previous => [...previous, saved]); }} />}
            {error && <p role="alert">{error}</p>}
            {!error && magazines.length === 0 && <p>No magazines yet.</p>}
            {magazines.map(magazine => (
                <Magazine
                    key={magazine.id}
                    magazine={magazine}
                    onDelete={handleDeleteMagazine}
                    onUpdate={handleUpdateMagazine}
                    onAddToCart={onAddToCart}
                    cartPending={cartPending}
                    canManage={isAdmin}
                />
            ))}
        </section>
    );
}