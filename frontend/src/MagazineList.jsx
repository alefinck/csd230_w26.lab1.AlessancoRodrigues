import Magazine from './Magazine.jsx';

export default function MagazineList({ magazines, loading, error, onDelete, onUpdate }) {
    if (loading) return <p>Loading magazines...</p>;
    return (
        <section aria-label="Magazine inventory">
            <h2>Magazines</h2>
            {error && <p role="alert">{error}</p>}
            {!error && magazines.length === 0 && <p>No magazines yet.</p>}
            {magazines.map(magazine => (
                <Magazine
                    key={magazine.id}
                    magazine={magazine}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                />
            ))}
        </section>
    );
}