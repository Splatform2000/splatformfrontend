import React from 'react';
import { useSelector } from 'react-redux';

const AdminProfile = () => {
    const { currentUser } = useSelector((state) => state.user);

    return (
        <div className="profile-container">
            <h2>User Profile</h2>
            <div className="user-details-box">
                <div className="user-detail">
                    <label>Name:</label>
                    <span>{currentUser.name}</span>
                </div>
                <div className="user-detail">
                    <label>Email:</label>
                    <span>{currentUser.email}</span>
                </div>
                <div className="user-detail">
                    <label>School:</label>
                    <span>{currentUser.schoolName}</span>
                </div>
            </div>
            <style jsx>{`
                .profile-container {
                    margin: 20px;
                }
                .user-details-box {
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    padding: 20px;
                    margin-bottom: 20px;
                    background-color: #f9f9f9;
                }
                .user-detail {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
};

export default AdminProfile;
