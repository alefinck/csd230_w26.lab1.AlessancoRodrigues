import { useState } from 'react';

export default function DiscMag({ discMag, onDelete, onUpdate, onAddToCart, cartPending, canManage }) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(discMag);
    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    function beginEdit() {
        setDraft(discMag);
        setError('');
        setIsEditing(true);
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target;
        setDraft(previous => ({
            ...previous,
            [name]: type === 'checkbox' ? checked : value
        }));
    }

    async function handleSave(event) {
        event.preventDefault();
        setError('');
        setSaving(true);
        try {
            await onUpdate(discMag.id, {
                ...draft,
                price: Number(draft.price),
                copies: Number(draft.copies),
                issueNumber: Number(draft.issueNumber),
                hasDisc: Boolean(draft.hasDisc)
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
            <form className="discmag-row editing" onSubmit={handleSave}>
                <label>Title<input name="title" value={draft.title} onChange={handleChange} required /></label>
                <label>Publisher<input name="publisher" value={draft.publisher} onChange={handleChange} required /></label>
                <label>Issue Number<input name="issueNumber" type="number" min="1" value={draft.issueNumber} onChange={handleChange} required /></label>
                <label>Price<input name="price" type="number" min="0" step="0.01" value={draft.price} onChange={handleChange} required /></label>
                <label>Copies<input name="copies" type="number" min="0" step="1" value={draft.copies} onChange={handleChange} required /></label>
                <label className="checkbox-label">
                    Has Disc
                    <input name="hasDisc" type="checkbox" checked={Boolean(draft.hasDisc)} onChange={handleChange} />
                </label>
                <button disabled={saving}>Save</button>
                <button type="button" disabled={saving} onClick={() => setIsEditing(false)}>Cancel</button>
                {error && <p role="alert">{error}</p>}
            </form>
        );
    }

    return (
        <article className="discmag-row">
            <h3>{discMag.title}</h3>
            <p>
                {discMag.publisher} (Issue #{discMag.issueNumber}) | ${Number(discMag.price).toFixed(2)} | Copies: {discMag.copies} | Has Disc: {discMag.hasDisc ? 'Yes' : 'No'}
            </p>
            <button disabled={cartPending} onClick={() => onAddToCart(discMag.id)}>Add to Cart</button>
            {canManage && <button onClick={beginEdit}>Edit</button>}
            {canManage && <button onClick={() => onDelete(discMag.id)}>Delete</button>}
        </article>
    );
}