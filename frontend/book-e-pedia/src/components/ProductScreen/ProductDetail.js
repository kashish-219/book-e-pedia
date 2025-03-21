import React, { useState, useEffect, useContext } from 'react';
import { Link,useParams } from 'react-router-dom';
import './ProductDetail.css';
import SingleProduct from './SingleProduct';
import { Carousel, Nav } from 'react-bootstrap';
import { CartContext, UserContext } from '../../Context';

function ProductDetail() {
  const [productData, setproductData] = useState({});
  const {product_slug,Product_ID} = useParams();
  const baseUrl = "http://127.0.0.1:8000/api";

  const { cartData = [], setCartData } = useContext(CartContext);

  useEffect(() => {
    fetchData(baseUrl + '/products/'+Product_ID);
  }, [Product_ID]);

  // Fetch product data based on the Product_ID
  function fetchData(url) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);  // Log the entire response to see the structure
        
        if (data && data.Product_ID) {
            setproductData(data);  // Set the product data
          } else {
            console.error("Product not found", data);
          }
      });
  }

  const cartAddButtonHandler = () => {
    let previousCart = localStorage.getItem('cartData');
    let cartJson = JSON.parse(previousCart) || [];  // Ensure it's an array

    const cartData = {
        'product': {
            'id': productData.Product_ID,
            'prod_name': productData.Product_Name,
            'price' : productData.Product_Price,
            'image' : productData.Cover_Photo,
        },
        'user': {
            'id': 1
        },
        'quantity' : 1
    };

    // Check if the product already exists in the cart
    const existingItemIndex = cartJson.findIndex(item => item.product.id === productData.Product_ID);

    if (existingItemIndex !== -1) {
        // If product exists, just increase its quantity
        cartJson[existingItemIndex].quantity += 1;
    } else {
        // If product is not in the cart, add it
        cartJson.push(cartData);
    }

    // Update local storage and context
    localStorage.setItem('cartData', JSON.stringify(cartJson));
    setCartData(cartJson);
};



  const cartRemoveButtonHandler = () =>{
    var previousCart = localStorage.getItem('cartData');
    var cartJson = JSON.parse(previousCart);
    cartJson.map((cart,index)=>{
      if(cart != null && cart.product.id == productData.id)
      {
        // delete cartJson[index];
        cartJson.splice(index,1);
      }
    });
    var cartString = JSON.stringify(cartJson);
    localStorage.setItem('cartData',cartString);
    // setcartButtonClickStatus(false)
    setCartData(cartJson)
  }

  // Create an array of images
  const productImgs = [
    { image: productData.Cover_Photo },
    { image: productData.Back_Photo }
  ];

  // State to track the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle next image
  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % productImgs.length);
  };

  // Handle previous image
  const prevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + productImgs.length) % productImgs.length
    );
  };

  return (
    <div className="product-detail-body">
      <div className="product-detail-container">
        <div className="product-detail-carousel">
          <div className="product-detail-carousel-images">
            {
                productImgs.map((img,index)=>
                <img
                src={productImgs[currentIndex].image}
                alt={`Slide ${currentIndex}`}
                className="product-detail-image"/>
                // </div>
                )
            }        
          </div>
          <div className="product-detail-carousel-controls">
          <button onClick={prevImage}>&#10094;</button>
          <button onClick={nextImage}>&#10095;</button>
        </div>
        </div>

        <div className="product-details">
          <h2>{productData.Product_Name}</h2>
          <div className="product-detail-info">
            <div><span className="product-detail-label">Author Name:</span> {productData.Author}</div>
            <div><span className="product-detail-label">Publisher:</span> {productData.Publisher}</div>
            <div><span className="product-detail-label">Language:</span> {productData.Language}</div>
            <div><span className="product-detail-label">Number of Pages:</span> {productData.Number_of_Pages}</div>
            <div><span className="product-detail-label">Time Duration:</span> {productData.Time_Duration}</div>
          </div>
          <div className="product-detail-description">{productData.Product_Description}</div>
          <div className="product-detail-price">Price: Rs. {productData.Product_Price}</div>

          <Nav.Link as={Link} to="/cart">
                  <button type='button' onClick={cartAddButtonHandler} className="product-detail-add-to-cart">Add to Cart</button>
                </Nav.Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
