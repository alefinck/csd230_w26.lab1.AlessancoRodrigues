import { useState } from 'react';

export default function Magazine({ magazine, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(magazine);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function beginEdit() {
        setDraft(magazine);
        setError('');
        setIsEditing(true);
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setDraft(previous => ({ ...previous, [name]: value }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onUpdate(magazine.id, {
                ...draft,
                price: Number(draft.price),
                copies: Number(draft.copies),
                issueNumber: Number(draft.issueNumber)
            });
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (isEditing) {
        return (
            <form className="magazine-row editing" onSubmit={handleSave}>
                <label>Title<input name="title" value={draft.title} onChange={handleChange} required /></label>
                <label>Publisher<input name="publisher" value={draft.publisher} onChange={handleChange} required /></label>
                <label>Issue Number<input name="issueNumber" type="number" min="1" value={draft.issueNumber} onChange={handleChange} required /></label>
                <label>Price<input name="price" type="number" min="0" step="0.01" value={draft.price} onChange={handleChange} required /></label>
                <label>Copies<input name="copies" type="number" min="0" step="1" value={draft.copies} onChange={handleChange} required /></label>
                <button disabled={saving}>Save</button>
                <button type="button" disabled={saving} onClick={() => setIsEditing(false)}>Cancel</button>
                {error && <p role="alert">{error}</p>}
            </form>
        );
    }

    return (
        <article className="magazine-row">
            <h3>{magazine.title}</h3>
            <p>{magazine.publisher} (Issue #{magazine.issueNumber}) | ${Number(magazine.price).toFixed(2)} | Copies: {magazine.copies}</p>
            <button onClick={beginEdit}>Edit</button>
            <button onClick={() => onDelete(magazine.id)}>Delete</button>
        </article>
    );
}