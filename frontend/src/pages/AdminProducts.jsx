import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminProducts.css';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user || !user.isAdmin) {
            navigate('/');
            return;
        }
        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/products', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Ürünler alınamadı');
            }

            const data = await res.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                alert('Ürün başarıyla silindi!');
            } else {
                alert('Ürün silinemedi!');
            }
        } catch (error) {
            alert('Bir hata oluştu!');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/products/${editingProduct._id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingProduct)
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
                setEditingProduct(null);
                alert('Ürün başarıyla güncellendi!');
            }
        } catch (error) {
            alert('Güncelleme hatası!');
        }
    };

    const filteredProducts = products.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="admin-loading">Yükleniyor...</div>;
    if (error) return <div className="admin-error">Hata: {error}</div>;

    return (
        <div className="admin-products-container">
            <div className="admin-header">
                <h1>Ürün Yönetim Paneli</h1>
                <div className="header-actions">
                    <button
                        className="add-product-btn"
                        onClick={() => navigate('/admin/add-product')}
                    >
                        + Yeni Ürün Ekle
                    </button>
                    <button
                        className="back-btn"
                        onClick={() => navigate('/')}
                    >
                        ↼ Ana Sayfa
                    </button>
                </div>
            </div>

            {/* Arama Kutusu */}
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* Düzenleme Modal */}
            {editingProduct && (
                <div className="modal-overlay">
                    <div className="edit-modal">
                        <h2>Ürün Düzenle</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="form-group">
                                <label>Ürün Adı</label>
                                <input
                                    type="text"
                                    value={editingProduct.title || ''}
                                    onChange={(e) => setEditingProduct({
                                        ...editingProduct,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Fiyat (₺)</label>
                                <input
                                    type="number"
                                    value={editingProduct.price || ''}
                                    onChange={(e) => setEditingProduct({
                                        ...editingProduct,
                                        price: parseFloat(e.target.value)
                                    })}
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Stok (adet)</label>
                                <input
                                    type="number"
                                    value={editingProduct.stock || ''}
                                    onChange={(e) => setEditingProduct({
                                        ...editingProduct,
                                        stock: parseInt(e.target.value, 10)
                                    })}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Açıklama</label>
                                <textarea
                                    value={editingProduct.description || ''}
                                    onChange={(e) => setEditingProduct({
                                        ...editingProduct,
                                        description: e.target.value
                                    })}
                                    rows="3"
                                />
                            </div>
                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => setEditingProduct(null)}
                                    className="cancel-btn"
                                >
                                    İptal
                                </button>
                                <button type="submit" className="save-btn">
                                    Kaydet
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Ürün Listesi */}
            <div className="products-grid">
                {filteredProducts.map(product => (
                    <div key={product._id} className="product-card">
                        {product.images?.[0] && (
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                className="product-image"
                            />
                        )}
                        <div className="product-info">
                            <h3 className="product-title">{product.title}</h3>
                            <p className="product-price">{product.price}₺</p>
                            <p className="product-description">
                                {product.description?.substring(0, 100)}...
                            </p>
                            <div className="product-stock">
                                Stok: {product.stock || 0} adet
                            </div>
                        </div>
                        <div className="product-actions">
                            <button
                                onClick={() => handleEdit(product)}
                                className="edit-btn"
                            >
                                Düzenle
                            </button>
                            <button
                                onClick={() => handleDelete(product._id)}
                                className="delete-btn"
                            >
                                Sil
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && !loading && (
                <div className="no-products">
                    {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz hiç ürün bulunmuyor'}
                </div>
            )}
        </div>
    );
}