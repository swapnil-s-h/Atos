import React from 'react';
import './DummyProfilePage.css';

const DummyProfilePage = () => {
    return (
        <div className="dummy-page">
            <div className="dummy-content">
                <h1>User Profile</h1>
                <p>Manage your personal information and preferences.</p>
                <div className="profile-section">
                    <h2>Profile Information</h2>
                    <div className="profile-info">
                        <div className="profile-item">
                            <strong>Name:</strong> John Doe
                        </div>
                        <div className="profile-item">
                            <strong>Email:</strong> john.doe@example.com
                        </div>
                        <div className="profile-item">
                            <strong>Phone:</strong> +1 234 567 8900
                        </div>
                        <div className="profile-item">
                            <strong>Account Type:</strong> Premium
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DummyProfilePage;
