import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import "../css/Search.css";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Search = () => {
    const query = useQuery().get('q')?.toLowerCase() || '';
    const { products } = useSelector((state) => state.product);
    const [sortBy, setSortBy] = useState('default');

    const filteredProducts = products.filter(product =>
        product.title && product.title.toLowerCase().includes(query)
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'stock-desc') return b.stock - a.stock;
        if (sortBy === 'stock-asc') return a.stock - b.stock;
        return 0;
    });

    return (
        <div className="search-container">
            <h2 className="search-title">Arama Sonuçları: "{query}"</h2>
            <div className="sort-container">
                <span className="sort-label">Sırala:</span>
                <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="sort-select"
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
            <div className="search-results">
                {sortedProducts.length > 0 ? (
                    <div className="products-grid">
                        {sortedProducts.map(product => (
                            <div key={product._id} className="search-product-card">
                                <img
                                    src={product.images?.[0] || '/images/default.jpg'}
                                    alt={product.title}
                                    className="search-product-image"
                                />
                                <div className="search-product-info">
                                    <h3 className="search-product-title">{product.title}</h3>
                                    <p className="search-product-price">{product.price.toFixed(2)} ₺</p>
                                    <p className="search-product-description">
                                        {product.description ? product.description.substring(0, 60) : "Açıklama yok"}...
                                    </p>
                                    <Link to={`/product-details/${product._id}`}>
                                        <button className="inspect-button">Detaylı İncele</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>"{query}" ile ilgili sonuç bulunamadı.</p>
                        <Link to="/" className="back-to-home">Ana Sayfaya Dön</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;