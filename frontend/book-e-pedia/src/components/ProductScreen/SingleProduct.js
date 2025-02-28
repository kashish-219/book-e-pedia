import React, { useState, useEffect, useContext }from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { CartContext, UserContext } from '../../Context';

function SingleProduct(props) {
  const {product} = props
  const { cartData = [], setCartData } = useContext(CartContext);
  const navigate = useNavigate();

  const cartAddButtonHandler = () => {
    let previousCart = localStorage.getItem('cartData');
    let cartJson = JSON.parse(previousCart) || [];  // Ensure it's an array

    // Check if the product already exists in the cart
    const existingProduct = cartJson.find(item => item.product.id === product.Product_ID);

    if (existingProduct) {
      // If the product already exists, redirect to the cart
      navigate('/cart');
    } else {
      // If the product does not exist, add it to the cart
      const cartData = {
        'product': {
          'id': product.Product_ID,
          'prod_name': product.Product_Name,
          'price': product.Product_Price,
          'image': product.Cover_Photo,
        },
        'user': {
          'id': 1
        },
        'quantity': 1
      };

      cartJson.push(cartData);
      localStorage.setItem('cartData', JSON.stringify(cartJson));
      setCartData(cartJson);
    }
  };


//   const cartAddButtonHandler = () => {
//     let previousCart = localStorage.getItem('cartData');
//     let cartJson = JSON.parse(previousCart) || [];  // Ensure it's an array

//     const cartData = {
//         'product': {
//             'id': product.Product_ID,
//             'prod_name': product.Product_Name,
//             'price' : product.Product_Price,
//             'image' : product.Cover_Photo,
//         },
//         'user': {
//             'id': 1
//         },
//         'quantity' : 1
//     };
//     if (Array.isArray(cartJson)) {
//         cartJson.push(cartData);
//         var cartString = JSON.stringify(cartJson);
//         localStorage.setItem('cartData',cartString);
//         setCartData(cartJson);
//     } else {
//         cartJson = [cartData];  // Reset as an array if it's not
//         var newCartList = [];
//         newCartList.push(cartData);
//         var cartString = JSON.stringify(newCartList);
//         localStorage.setItem('cartData',cartString);
//     }

//     // localStorage.setItem('cartData', JSON.stringify(cartJson));
//     // setcartButtonClickStatus(true);
// };

  return (
    <div>
      <Nav.Link as={Link} to={`/product/${product.Product_Name}/${product.Product_ID}`} key={product.Product_ID}>
              <div className="product">
                <img
                  src={product.Cover_Photo}
                  alt={product.Product_Name}
                  className="product-image"
                />
                <div className="product-name">{product.Product_Name}</div>
                <div className="author-name">By {product.Author}</div>
                <div className="product-price">Rs. {product.Product_Price}</div>
                <div className="product-description">
                  {product.Product_Description}
                </div>
                <Nav.Link as={Link} to="/cart">
                  <button type='button' onClick={cartAddButtonHandler} className="add-to-cart">Add to Cart</button>
                </Nav.Link>
              </div>
            </Nav.Link>
    </div>
  )
}

export default SingleProduct
