import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {brand, imageUrl, price, rating, title} = productDetails

  return (
    <li className="similar-product">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="price-rating">
        <p className="similar-product-price">Rs {price}/-</p>
        <p className="similar-product-rating">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
