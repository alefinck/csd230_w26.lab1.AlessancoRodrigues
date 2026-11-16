import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function AddDiscMagForm({ onDiscMagAdded }) {
    const [title, setTitle] = useState('');
    const [publisher, setPublisher] = useState('');
    const [issueNumber, setIssueNumber] = useState('');
    const [price, setPrice] = useState('');
    const [copies, setCopies] = useState(10);
    const [hasDisc, setHasDisc] = useState(true);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            const response = await fetch('/api/rest/discmags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    publisher,
                    issueNumber: Number(issueNumber),
                    price: Number(price),
                    copies: Number(copies),
                    hasDisc: Boolean(hasDisc)
                })
            });
            if (!response.ok) throw new Error(`Save failed (${response.status})`);
            const savedDiscMag = await response.json();
            onDiscMagAdded(savedDiscMag);
            setTitle('');
            setPublisher('');
            setIssueNumber('');
            setPrice('');
            setCopies(10);
            setHasDisc(true);
            navigate('/discmags');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="discmag-form">
            <h2>Add a New Disc Magazine</h2>
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
            <label className="checkbox-label">
                Has Disc
                <input
                    type="checkbox"
                    checked={hasDisc}
                    onChange={e => setHasDisc(e.target.checked)}
                />
            </label>
            <button disabled={saving}>Save Disc Magazine</button>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}