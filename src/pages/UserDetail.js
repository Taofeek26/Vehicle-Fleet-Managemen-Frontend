import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getUserDetail, updateUser, getUsers, getCurrentUser } from '../api';
import { UserCircle } from 'lucide-react'; // Icon for placeholder

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [userResponse, currentUserResponse, allUsersResponse] = await Promise.all([
          getUserDetail(id),
          getCurrentUser(),
          getUsers()
        ]);
        
        setUser(userResponse.data);
        setFormData(userResponse.data);
        setCurrentUser(currentUserResponse.data);
        setAllUsers(allUsersResponse.data);
        
      } catch (err) {
        setError('Failed to fetch user data.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setProfilePictureFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const submissionData = new FormData();
    // Append all form data
    for (const key in formData) {
      if (key === 'reports_to') {
        if (formData[key] === "" || formData[key] === null || formData[key] === "None") {
          submissionData.append(key, "");
        } else {
          submissionData.append(key, formData[key]);
        }
      } else if (formData[key] !== null && formData[key] !== undefined) {
        submissionData.append(key, formData[key]);
      }
    }
    // Append profile picture if selected
    if (profilePictureFile) {
      submissionData.append('profile_picture', profilePictureFile);
    }

    try {
      const response = await updateUser(id, submissionData);
      setUser(response.data);
      setIsEditMode(false);
      alert('User updated successfully!');
    } catch (err) {
      setError('Failed to update user.');
      console.error('Error updating user:', err.response?.data);
    }
  };

  const canEdit = currentUser && (currentUser.role === 'manager' || currentUser.id === parseInt(id));

  if (loading) return <div className="text-center py-4">Loading user details...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (!user) return <div className="text-center py-4">User not found.</div>;

  return (
    <div className="container mx-auto p-4">
      {!isEditMode ? (
        // VIEW MODE
        <div className="bg-white shadow-xl rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-center">
            {user.profile_picture ? (
              <img src={`http://127.0.0.1:8000${user.profile_picture}`} alt="Profile" className="w-32 h-32 rounded-full mr-8 border-4 border-gray-200"/>
            ) : (
              <UserCircle className="w-32 h-32 text-gray-400 mr-8"/>
            )}
            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
              <h1 className="text-3xl font-bold">{user.full_name || user.username}</h1>
              <p className="text-gray-600">{user.role}</p>
              <p className="text-gray-500">{user.email}</p>
              {canEdit && (
                <button onClick={() => setIsEditMode(true)} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><span className="font-semibold">Username:</span> {user.username}</p>
              <p><span className="font-semibold">Year Joined:</span> {user.year_joined || 'N/A'}</p>
              <p><span className="font-semibold">Type of Appointment:</span> {user.type_of_appointment || 'N/A'}</p>
              <p><span className="font-semibold">Reports To:</span> {user.reports_to_name || 'N/A'}</p>
            </div>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form onSubmit={handleUpdate} className="bg-white shadow-xl rounded-lg p-6">
          <div className="flex items-center mb-6">
            {user.profile_picture ? (
              <img src={`http://127.0.0.1:8000${user.profile_picture}`} alt="Profile" className="w-24 h-24 rounded-full mr-6"/>
            ) : (
              <UserCircle className="w-24 h-24 text-gray-400 mr-6"/>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Update Profile Picture</label>
              <input type="file" name="profile_picture" onChange={handleFileChange} ref={fileInputRef} className="mt-1 text-sm"/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="full_name" value={formData.full_name || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md"/>
            </div>
            
            {currentUser.role === 'manager' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md">
                    <option value="driver">Driver</option>
                    <option value="staff">Staff</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reports To</label>
                  <select name="reports_to" value={formData.reports_to || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md">
                    <option value="">None</option>
                    {allUsers.filter(u => u.id !== user.id).map(u => ( // Prevent self-reporting
                      <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Year Joined</label>
              <input type="number" name="year_joined" value={formData.year_joined || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type of Appointment</label>
              <input type="text" name="type_of_appointment" value={formData.type_of_appointment || ''} onChange={handleChange} className="w-full px-3 py-2 mt-1 border rounded-md"/>
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <button type="button" onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">Save Changes</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UserDetail;