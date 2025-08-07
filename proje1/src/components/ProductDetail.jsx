import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedProduct } from '../redux/slices/productSlice';
import '../css/ProductDetail.css'
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";
import { addToBasket, calculateBasket } from '../redux/slices/basketSlice';



function ProductDetail() {
    const { id } = useParams();
    const { products, selectedProduct } = useSelector((store) => store.product)

    const { image, price, title, description } = selectedProduct;

    const [count, setCount] = useState(0);

    const dispatch = useDispatch();

    const increment = () => {
        setCount(count + 1)
    }
    const decrement = () => {
        setCount(count - 1)
    }

    const addBasket = () => {
        const payload = {
            id,
            price,
            image,
            title,
            description,
            count
        }

        dispatch(addToBasket(payload));
        dispatch(calculateBasket());
    }

    useEffect(() => {
        getProductbyid();
    }, [])

    const getProductbyid = () => {
        products && products.map((product) => {
            if (product.id == id) {
                dispatch(setSelectedProduct(product));
            }
        })
    }

    return (
        <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div style={{ marginRight: '40px' }}>
                <img src={image} width={300} height={500} alt='' />
            </div>
            <div>
                <h1>{title}</h1>
                <p>{description}</p>
                <h1 className='price'>{price}₺</h1>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CiCirclePlus onClick={increment} style={{ fontSize: '40px', marginRight: '15px' }} /><span style={{ fontSize: '45px' }}>{count}</span>
                    <CiCircleMinus onClick={decrement} style={{ fontSize: '40px', marginLeft: '15px' }} />
                </div>

                <div>
                    <button
                        onClick={addBasket}
                        className='sepete-ekle'>Sepete Ekle</button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail