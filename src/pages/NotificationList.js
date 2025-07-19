import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationAsRead } from '../api';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        // Sort notifications by created_at in descending order
        const sortedNotifications = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(sortedNotifications);
      } catch (err) {
        setError('Failed to fetch notifications.');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prevNotifications =>
        prevNotifications.map(notif =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) return <div className="text-center py-4">Loading notifications...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Your Notifications</h1>
      {notifications.length === 0 ? (
        <div className="text-center py-4">No new notifications.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white shadow-md rounded-lg p-4 flex justify-between items-center ${notification.is_read ? 'opacity-60' : ''}`}
            >
              <div>
                <p className="font-semibold">{notification.message}</p>
                <p className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</p>
              </div>
              {!notification.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList;