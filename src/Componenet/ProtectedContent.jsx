import React from 'react';

const ProtectedContent = ({ user }) => {
    return (
        <div>
            {user ? (
                <h2>Welcome to Protected Content, {user.displayName}!</h2>
            ) : (
                <p>You do not have permission to view this content. Please log in.</p>
            )}

        </div>
    );
};

export default ProtectedContent;
