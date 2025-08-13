import React, { useState } from "react";
import "../css/Payment.css";

const Payment = () => {
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiry = (value) => {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length >= 3) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return value;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus("processing");

        // Simulate payment processing
        setTimeout(() => {
            setStatus("success");
            // Clear form
            setCardNumber("");
            setExpiry("");
            setCvc("");
            setName("");
        }, 2000);
    };

    return (
        <div className="payment-container">
            <h2 className="payment-title">Ödeme Bilgileri</h2>
            <form onSubmit={handleSubmit} className="payment-form">
                <input
                    type="text"
                    placeholder="Kart Numarası"
                    value={formatCardNumber(cardNumber)}
                    onChange={e => setCardNumber(e.target.value.replace(/\s/g, ''))}
                    className="card-number-input"
                    required
                    maxLength={19}
                />

                <div className="form-row">
                    <input
                        type="text"
                        placeholder="AA/YY"
                        value={formatExpiry(expiry)}
                        onChange={e => setExpiry(e.target.value)}
                        className="expiry-input"
                        required
                        maxLength={5}
                    />
                    <input
                        type="text"
                        placeholder="CVC"
                        value={cvc}
                        onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                        className="cvc-input"
                        required
                        maxLength={4}
                    />
                </div>

                <input
                    type="text"
                    placeholder="Kart Üzerindeki İsim"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />

                <button type="submit" className="submit-button">
                    Ödemeyi Tamamla
                </button>
            </form>

            {status === "processing" && (
                <div className="payment-status processing">
                    Ödeme işleniyor...
                </div>
            )}

            {status === "success" && (
                <div className="payment-status success">
                    Ödeme başarılı! Siparişiniz alındı.
                </div>
            )}
        </div>
    );
};

export default Payment;