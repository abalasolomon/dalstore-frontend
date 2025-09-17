import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listNotifications,
  markNotificationRead,
  getNotificationCount,
} from "../../redux/actions/notificationActions";
import Loader from "../../common/Loader";
import Message from "../../common/Message";

const Getnotifications = () => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(null);

  const { loading, error, notifications } = useSelector(
    (state) => state.notificationList
  );
  const { unread } = useSelector((state) => state.notificationCount);

  useEffect(() => {
    dispatch(listNotifications());
    dispatch(getNotificationCount());
  }, [dispatch]);

  const handleExpand = (id, isRead) => {
    setExpanded((prev) => (prev === id ? null : id));
    if (!isRead) {
      dispatch(markNotificationRead(id));
    }
  };

  return (
    <div>
      <h4>
        Notifications{" "}
        <span className="badge bg-danger">{unread}</span>
      </h4>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : notifications.length === 0 ? (
        <Message>No notifications available.</Message>
      ) : (
        <ul className="list-group">
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => handleExpand(n.id, n.is_read)}
              className={`list-group-item ${
                n.is_read ? "" : "bg-light fw-bold"
              }`}
              style={{ cursor: "pointer" }}
            >
              <div>
                <strong>{n.title}</strong>
                {expanded === n.id && (
                  <>
                    <p className="mb-0">{n.message}</p>
                    <small className="text-muted">
                      {new Date(n.created_at).toLocaleString()}
                    </small>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Getnotifications;
