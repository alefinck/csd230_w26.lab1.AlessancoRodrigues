import DiscMag from './DiscMag.jsx';

export default function DiscMagList({ discMags, loading, error, onDelete, onUpdate, onAddToCart, cartPending, canManage }) {
    if (loading) return <p>Loading disc magazines...</p>;
    return (
        <section aria-label="Disc Magazine inventory">
            <h2>Disc Magazines</h2>
            {error && <p role="alert">{error}</p>}
            {!error && discMags.length === 0 && <p>No disc magazines yet.</p>}
            {discMags.map(discMag => (
                <DiscMag
                    key={discMag.id}
                    discMag={discMag}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onAddToCart={onAddToCart}
                    cartPending={cartPending}
                    canManage={canManage}
                />
            ))}
        </section>
    );
}