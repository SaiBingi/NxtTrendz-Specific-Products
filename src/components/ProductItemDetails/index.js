import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetails: {},
    cartItemsCount: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  updateDataToCamelCase = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
    id: data.id,
  })

  onClickPlusIcon = () =>
    this.setState(prevState => ({cartItemsCount: prevState.cartItemsCount + 1}))

  onClickMinusIcon = () => {
    const {cartItemsCount} = this.state

    if (cartItemsCount > 1) {
      this.setState(prevState => ({
        cartItemsCount: prevState.cartItemsCount - 1,
      }))
    }
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products.map(eachProduct =>
          this.updateDataToCamelCase(eachProduct),
        ),
        title: data.title,
        totalReviews: data.total_reviews,
        id: data.id,
      }

      this.setState({
        productItemDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })

      console.log(response)
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductDetailsView = () => {
    const {productItemDetails, cartItemsCount} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      similarProducts,
      title,
      totalReviews,
    } = productItemDetails

    return (
      <>
        <Header />
        <div className="container">
          <div className="product-items-container">
            <img src={imageUrl} alt="product" className="product-item-image" />
            <div>
              <h1 className="product-item-title">{title}</h1>
              <p className="price">Rs {price}/-</p>
              <div className="rating-review">
                <p className="product-rating">
                  {rating}
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-icon"
                  />
                </p>
                <p className="review">{totalReviews} Reviews</p>
              </div>
              <p className="description">{description}</p>
              <div className="available-brand">
                <p className="available-and-brand">Available:</p>
                <p className="available-and-brand-value">{availability}</p>
              </div>
              <div className="available-brand">
                <p className="available-and-brand">Brand:</p>
                <p className="available-and-brand-value">{brand}</p>
              </div>

              <hr className="hr-line" />
              <div className="increase-decrease-items">
                <button
                  type="button"
                  onClick={this.onClickMinusIcon}
                  className="increase-decrease-button"
                  testid="minus"
                >
                  <BsDashSquare className="add-delete-icon" />
                </button>
                <p className="count-display">{cartItemsCount}</p>
                <button
                  type="button"
                  onClick={this.onClickPlusIcon}
                  className="increase-decrease-button"
                  testid="plus"
                >
                  <BsPlusSquare className="add-delete-icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="similar-product-items-container">
            <h1 className="similar-products-heading">Similar Products</h1>
            <ul className="similar-products-list">
              {similarProducts.map(productItem => (
                <SimilarProductItem
                  productDetails={productItem}
                  key={productItem.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="error-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-view"
        />
        <h1 className="product-error-view-message">Product Not Found</h1>
        <Link to="/products" className="nav-item-link">
          <button type="button" className="continue-shopping-button">
            Continue Shopping
          </button>
        </Link>
      </div>
    </>
  )

  renderLoadingView = () => (
    <div className="container">
      <div testid="loader">
        <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
      </div>
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return this.renderProductDetails()
  }
}

export default ProductItemDetails
