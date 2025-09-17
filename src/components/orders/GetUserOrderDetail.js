import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserOrderDetail } from "../../redux/actions/orderActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";

const GetUserOrderDetail = () => {
  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  const orderDetail = useSelector((state) => state.orderDetail || {});
  const { loading, error, order } = orderDetail;
console.log("orderDetail", order);
  useEffect(() => {
    if (orderId) {
      dispatch(getUserOrderDetail(orderId));
    }
  }, [dispatch, orderId]);

  return (
    <div className="container mt-4">
      <h2>Order Details</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        order && (
          <>
            {/* Order Info */}
            <div className="mb-4">
              <h5>Order #{order.id}</h5>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(order.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ₦{order.total}
              </p>
            </div>

            {/* Payment Info */}
            {order.payment && (
              <div className="mb-4">
                <h5>Payment Info</h5>
                <p>
                  <strong>Method:</strong> {order.payment.method}
                </p>
                <p>
                  <strong>Status:</strong> {order.payment.status}
                </p>
                <p>
                  <strong>Reference:</strong> {order.payment.reference}
                </p>
                <p>
                  <strong>Amount:</strong> ₦{order.payment.amount}
                </p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h5>Items</h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>{item.variant_name || "-"}</td>
                      <td>₦{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>₦{item.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  );
};

export default GetUserOrderDetail;
