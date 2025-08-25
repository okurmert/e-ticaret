import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminAddProduct.css';

export default function AddProduct() {
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        stock: '',
        images: '',
        description: '',
        category: ''
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories', { credentials: 'include' });
                const data = await res.json();
                if (res.ok && Array.isArray(data)) {
                    setCategories(data);
                    setFormData(prev => ({
                        ...prev,
                        category: data[0]?._id || ''
                    }));
                }
            } catch (error) {
                setCategories([]);
            }
        }
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: formData.title,
                    price: Number(formData.price),
                    stock: formData.stock,
                    description: formData.description,
                    category: formData.category
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ text: 'Ürün başarıyla eklendi!', type: 'success' });
                setFormData({
                    title: '',
                    price: '',
                    stock: '',
                    images: '',
                    description: '',
                    category: categories[0]?._id || ''
                });
                setTimeout(() => navigate('/admin/products'), 1500);
            } else {
                setMessage({ text: data.message || 'Ürün eklenemedi!', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Bir hata oluştu!', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="admin-add-product-container">
            <div className="admin-header">
                <h1>Ürün Yönetimi</h1>
                <button
                    className="back-button"
                    onClick={() => navigate('/admin/products')}
                >
                    &larr; Ürün Listesine Dön
                </button>
            </div>

            <div className="add-product-card">
                <h2>Yeni Ürün Ekle</h2>

                <form onSubmit={handleSubmit} className="admin-product-form">
                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label className="admin-form-label">Ürün Adı*</label>
                            <input
                                className="admin-form-input"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Örnek: iPhone 13 Pro"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Fiyat (₺)*</label>
                            <input
                                className="admin-form-input"
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="Örnek: 19999.99"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Stok*</label>
                            <input
                                className="admin-form-input"
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Örnek: 100"
                                min="0"
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label className="admin-form-label">Kategori*</label>
                            <select
                                className="admin-form-select"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.length === 0 && (
                                    <option value="">Kategori bulunamadı</option>
                                )}
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Görsel URL'leri*</label>
                        <input
                            className="admin-form-input"
                            type="text"
                            name="images"
                            value={formData.images}
                            onChange={handleChange}
                            placeholder="URL1, URL2, URL3 (virgülle ayırın)"
                            required
                        />
                        <small className="hint">En az 1 görsel URL'si girin</small>
                    </div>

                    <div className="admin-form-group">
                        <label className="admin-form-label">Açıklama</label>
                        <textarea
                            className="admin-form-textarea"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Ürün detaylarını yazın..."
                            rows="5"
                        />
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate('/admin/products')}
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="admin-submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Ekleniyor...' : 'Ürünü Ekle'}
                        </button>
                    </div>
                </form>

                {message.type === 'success' && (
                    <div className="admin-message-success">
                        {message.text}
                    </div>
                )}
                {message.type === 'error' && (
                    <div className="admin-message-error">
                        {message.text}
                    </div>
                )}
            </div>
        </div>
    );
}