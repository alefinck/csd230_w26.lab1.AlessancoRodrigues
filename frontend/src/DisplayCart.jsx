export default function DisplayCart({ cart, loading, error, pending, onRemove }) {
    return (
        <section aria-label="Your cart">
            <h2>Your cart</h2>
            {loading && <p>Loading cart...</p>}
            {error && <p role="alert">{error}</p>}
            {!loading && !error && !cart?.products?.length && <p>Your cart is empty.</p>}
            {cart?.products?.map(product => (
                <article key={product.id}>
                    <h3>{product.title || product.description || `${product.productType || 'Product'} #${product.id}`}</h3>
                    <p>${Number(product.price).toFixed(2)}</p>
                    <button disabled={pending} onClick={() => onRemove(product.id)}>Remove</button>
                </article>
            ))}
        </section>
    );
}