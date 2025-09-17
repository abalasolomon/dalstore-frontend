import React from "react";
import { Card, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { StarFill } from "react-bootstrap-icons";

const ProductCard = ({ product }) => {
  const {
    id,
    title,
    slug,
    price,
    promo_price,
    category,
    images = [],
    rating,
  } = product;

  const imageUrl = images.length > 0 ? images[0].image : "/placeholder.jpg";

  return (
    <Card className="mb-4 shadow-sm border-0 product-card h-100">
      <Link to={`/product/${slug}`}>
        <Card.Img
          variant="top"
          src={imageUrl}
          alt={title}
          className="product-card-img"
          style={{ height: "220px", objectFit: "cover" }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${slug}`} className="text-decoration-none text-dark">
          <Card.Title as="h5" className="mb-1">
            {title.length > 45 ? `${title.slice(0, 42)}...` : title}
          </Card.Title>
        </Link>
        {category && (
          <Badge bg="light" text="dark" className="mb-2">
            {category.name}
          </Badge>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {promo_price ? (
              <>
                <span className="text-muted text-decoration-line-through me-2">
                  ₦{price.toLocaleString()}
                </span>
                <strong className="text-danger">₦{promo_price.toLocaleString()}</strong>
              </>
            ) : (
              <strong>₦{price.toLocaleString()}</strong>
            )}
          </div>
          {rating && (
            <div className="text-warning">
              <StarFill size={16} className="me-1" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
