# 🛒 E-Ticaret Projesi

Bu proje, **React (Frontend) + Node.js (Backend) + MongoDB (Database)** teknolojileri kullanılarak geliştirilmiş tam kapsamlı bir e-ticaret uygulamasıdır. Bir staj programı kapsamında geliştirilen bu modern e-ticaret platformu, kullanıcılara ürünleri görüntüleme, gelişmiş filtreleme ve sıralama özelliklerini kullanma, sepete ekleme ve güvenli ödeme işlemleri gerçekleştirme imkanı sunan kapsamlı bir alışveriş deneyimi sağlamaktadır. 

##  Özellikler

- **Ürün Yönetimi**
  - MongoDB’de ürünlerin kategori bazlı tutulması
  - Kategorilere göre filtreleme
  - Fiyat ve diğer metriklere göre **sorting** (sıralama)
  - Çalışan **arama çubuğu**

- **Kullanıcı Yönetimi**
  - JWT tabanlı **giriş yap / üye ol** sistemi
  - Kullanıcı bilgileri MongoDB’de saklanır
  - Kullanıcı sepeti farklı cihazlardan erişildiğinde senkronize şekilde çalışır

- **Sepet & Sipariş**
  - Ürünler sepete eklenebilir
  - Sepet bilgileri oturum bazlı değil kullanıcı bazlıdır
  - Kullanıcı farklı cihazlardan giriş yaptığında sepeti korunur

- **Admin Paneli**
  - Admin yetkisi verilen kullanıcılar:
    - Yeni ürün ekleyebilir
    - Var olan ürünleri düzenleyebilir / silebilir
  - Tüm ürünler admin panelinde listelenir

- **Ekstra Özellikler**
  - **Dark Mode** desteği
  - Modern, kullanıcı dostu arayüz

---

## 🛠 Kullanılan Teknolojiler

- **Frontend:** React, Redux, Context API  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ile)  
- **Authentication:** JWT (JSON Web Token)  
- **Stil:** CSS  

---

## 📂 Proje Yapısı

```
e-ticaret-proje/
│
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminProducts.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Basket.jsx
    │   │   ├── BasketDrawer.jsx
    │   │   ├── Header.jsx
    │   │   ├── Loading.jsx
    │   │   ├── Product.jsx
    │   │   └── ProductDetail.jsx
    │   ├── config/
    │   │   ├── RouterConfig.jsx
    │   ├── container/
    │   │   ├── PageContainer.jsx
    │   ├── context/
    │   │   ├── CartContext.jsx
    │   ├── css/
    │   │   ├── AccountDetails.css
    │   │   ├── AdminAddProduct.css
    │   │   ├── AdminProducts.css
    │   │   ├── BasketDrawer.css
    │   │   ├── Header.css
    │   │   ├── LoginSignUp.css
    │   │   ├── Payment.css
    │   │   ├── Product.css
    │   │   ├── ProductDetail.css
    │   │   └── Search.css
    │   ├── images/
    │   ├── pages/
    │   │   ├── AccountDetails.jsx
    │   │   ├── AdminAddProduct.jsx
    │   │   ├── AdminProducts.jsx
    │   │   ├── Home.jsx
    │   │   ├── LoginSignUp.jsx
    │   │   ├── Payment.jsx
    │   │   └── Search.jsx
    │   ├── redux/
    │   │   ├── store.jsx
    │   │   ├── slices
    │   │   │   ├── appSlice.jsx
    │   │   │   ├── basketSlice.jsx
    │   │   │   ├── productSlice.jsx
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── index.html
```

---

## ⚙️ Kurulum ve Çalıştırma

1. **Projeyi klonla:**
   ```bash
   git clone https://github.com/kullanici/e-ticaret-projesi.git
   cd e-ticaret-projesi
   ```

2. **Backend bağımlılıklarını yükle:**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend bağımlılıklarını yükle:**
   ```bash
   cd frontend
   npm install
   ```

4. **Ortam değişkenlerini ayarla (`.env`):**

  Backend dizininde .env adında bir dosya oluşturun ve aşağıdaki değişkenleri ekleyin:

   ```
   MONGO_URI=mongodb+srv://kullanici:parola@cluster.mongodb.net/ecommerce
   JWT_SECRET=senin_secret_keyin
   PORT=4000
   ```

5. **Backend’i çalıştır:**
   ```bash
   cd backend
   node server.js
   ```

6. **Frontend’i çalıştır:**
   ```bash
   cd frontend
   npm run dev
   ```

---

## API Endpoint'leri

POST /api/auth/register - Kullanıcı kaydı

POST /api/auth/login - Kullanıcı girişi

GET /api/products - Tüm ürünleri getir

GET /api/products/:id - Belirli bir ürünü getir

POST /api/admin/products - Yeni ürün ekle (admin)

PUT /api/admin/products/:id - Ürün güncelle (admin)

DELETE /api/admin/products/:id - Ürün sil (admin)

GET /api/categories - Tüm kategorileri getir

GET /api/cart - Kullanıcı sepetini getir

POST /api/cart - Sepete ürün ekle

PUT /api/cart/:productId - Sepetteki ürünü güncelle

DELETE /api/cart/:productId - Sepetten ürün kaldır

POST /api/orders - Sipariş oluştur

---

## 📸 Ekran Görselleri




---

## ✨ Gelecek Geliştirmeler

- Ödeme entegrasyonu (PayPal / Stripe)
- Kullanıcı yorum & değerlendirme sistemi
- Mobil uyum optimizasyonu