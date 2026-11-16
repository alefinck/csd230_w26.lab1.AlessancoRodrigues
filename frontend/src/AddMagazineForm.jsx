import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function AddMagazineForm({ onMagazineAdded }) {
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [issueNumber, setIssueNumber] = useState('');
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
            const response = await fetch('/api/rest/magazines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    publisher,
                    issueNumber: Number(issueNumber),
                    price: Number(price),
                    copies: Number(copies)
                })
            });
            if (!response.ok) throw new Error(`Save failed (${response.status})`);
            const savedMagazine = await response.json();
            onMagazineAdded(savedMagazine);
            setTitle('');
            setPublisher('');
            setIssueNumber('');
            setPrice('');
            setCopies(10);
            navigate('/magazines');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="magazine-form">
            <h2>Add a New Magazine</h2>
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
                Publisher
                <input
                    type="text"
                    value={publisher}
                    onChange={e => setPublisher(e.target.value)}
                    required
                />
            </label>
            <label>
                Issue Number
                <input
                    type="number"
                    min="1"
                    value={issueNumber}
                    onChange={e => setIssueNumber(e.target.value)}
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
            <button disabled={saving}>Save Magazine</button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}