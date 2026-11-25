import api from './api.js';
import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function AddBookForm({ onBookAdded }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState(10);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            const response = await api.post('/books', {
                title,
                author,
                price: Number(price),
                copies: Number(copies)
            });
            const savedBook = response.data;
            onBookAdded(savedBook);
            setTitle('');
            setAuthor('');
            setPrice('');
            setCopies(10);
            navigate('/inventory');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="book-form">
            <h2>Add a New Book</h2>
            <label>
                Title
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                />
            </label>
            <label>
                Author
                <input
                    type="text"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    required
                />
            </label>
            <label>
                Price
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                />
            </label>
            <label>
                Copies
                <input
                    type="number"
                    min="0"
                    step="1"
                    value={copies}
                    onChange={e => setCopies(e.target.value)}
                    required
                />
            </label>
            <button disabled={saving}>Save Book</button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}