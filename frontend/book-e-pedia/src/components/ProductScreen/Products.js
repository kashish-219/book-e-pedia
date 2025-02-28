import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
// import CustomerCart from "../CustomerPanel/CustomerCart/CustomerCart";
import "./Products.css";
import SingleProduct from "./SingleProduct";

const Products = () => {
  //Using useState concept
  const [products, setProducts] = useState([]);
  const baseUrl = "http://127.0.0.1:8000/api";
  const [totalResult, setTotalResults] = useState(0); //Pagination

  //Using useEffect concept
  useEffect(() => {
    fetchData(baseUrl + "/products/");
  }, []);

  function fetchData(baseurl) {
    fetch(baseurl)
      .then((response) => response.json())
      .then((data) => {
        const activeProducts = data.data.filter(
          (product) => product.IsActive === "1"
        );
        setProducts(activeProducts);
        setTotalResults(activeProducts.length);
      });
  }

  function changeUrl(baseurl) {
    // setbaseurl(baseurl);
    fetchData(baseurl);
  }

  var links = []; //creting links for pagination
  var limit = 1; //how many data to show on the pages
  var totalLinks = totalResult / limit;

  for (let i = 1; i <= totalLinks; i++) {
    links.push(
      <li class="page-item">
        <Link
          onClick={() => changeUrl(baseUrl + `/products/?page=${i}`)}
          to={`/products/?page=${i}`}
          class="page-link"
        >
          {i}
        </Link>
      </li>
    );
  }

  return (
    <div className="product-container">
      <h1>Shop Our Book Collection</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map((product, index) => (
            <SingleProduct key={index} product={product} />
          ))
        ) : (
          <p>No active products available.</p>
        )}
      </div>
      <ul className="pagination">{links}</ul>
    </div>
  );
};

export default Products;
