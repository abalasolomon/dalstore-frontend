import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../redux/actions/orderActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";
import { Link } from "react-router-dom";

const GetUserOrders = () => {
  const dispatch = useDispatch();

  const userOrders = useSelector((state) => state.userOrders || {});
  const { loading, error, orders } = userOrders;

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">My Orders</h2>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders?.length === 0 ? (
        <Message>No orders found</Message>
      ) : (
         <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th>Items</th>
              <th>Date</th>
              <th>Total</th>
              {/* <th>Paid</th> */}
              <th>Status</th>
              <th>Booking Type</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id}>
                <td>{order.items?.length || 0}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>₦{order.total}</td>
                {/* <td>{order.payment?.status === "successful" ? "Yes" : "No"}</td> */}
                <td>{order.status}</td>
                <td className="text-capitalize">{order.fulfillment_method}</td>
                <td>
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-sm btn-dark"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GetUserOrders;
