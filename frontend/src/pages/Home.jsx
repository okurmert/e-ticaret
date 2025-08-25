import React, { useEffect, useState } from 'react';
import Product from '../components/Product';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [sortBy, setSortBy] = useState('default');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                if (!res.ok) throw new Error('Ürün getirme hatası: ' + res.status);
                const data = await res.json();
                setProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchProducts();
    }, []);

    const fetchProducts = async (categoryName) => {
        const res = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}`);
        const data = await res.json();
        setProducts(data);
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        return 0;
    });

    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 'bold', marginBottom: '18px' }}>Kategoriler</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap' }}>
                <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        style={{
                            padding: '10px 22px',
                            borderRadius: '6px',
                            border: 'none',
                            background: !selectedCategory ? 'lightcoral' : '#fff',
                            color: !selectedCategory ? 'white' : 'lightcoral',
                            fontWeight: !selectedCategory ? 'bold' : 'normal',
                            boxShadow: !selectedCategory ? '0 2px 5px rgba(233,71,71,0.15)' : 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => {
                            setSelectedCategory('');
                            fetchProducts('');
                        }}
                    >
                        Tümü
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            style={{
                                padding: '10px 22px',
                                borderRadius: '6px',
                                border: 'none',
                                background: selectedCategory === cat.name ? 'lightcoral' : '#fff',
                                color: selectedCategory === cat.name ? 'white' : 'lightcoral',
                                fontWeight: selectedCategory === cat.name ? 'bold' : 'normal',
                                boxShadow: selectedCategory === cat.name ? '0 2px 5px rgba(233,71,71,0.15)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => {
                                setSelectedCategory(cat.name);
                                fetchProducts(cat.name);
                            }}
                        >
                            {cat.name}
                        </button>
                    ))}
                </nav>
                <div style={{ display: 'flex', alignItems: 'center', background: 'lightcoral', padding: '12px 18px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(233,71,71,0.10)', maxWidth: '400px', marginLeft: 'auto' }}>
                    <span style={{ fontWeight: 'bold', marginRight: '14px', fontSize: '18px', color: 'white' }}>Sırala:</span>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        style={{
                            padding: '8px 18px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '16px',
                            background: 'white',
                            color: 'lightcoral',
                            fontWeight: '500',
                            boxShadow: '0 1px 4px rgba(233,71,71,0.08)',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                    >
                        <option value="default">Varsayılan Sıralama</option>
                        <option value="price-asc">Fiyat (Artan)</option>
                        <option value="price-desc">Fiyat (Azalan)</option>
                        <option value="title-asc">İsim (A-Z)</option>
                        <option value="title-desc">İsim (Z-A)</option>
                        <option value="stock-asc">Stok (Artan)</option>
                        <option value="stock-desc">Stok (Azalan)</option>
                    </select>
                </div>
            </div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 'bold' }}>Ürünler</h2>
            <div>
                {sortedProducts.length === 0 ? (
                    <p>Ürün bulunamadı.</p>
                ) : (
                    <Product products={sortedProducts} />
                )}
            </div>
        </div>
    );
};

export default Home;