import React from 'react';


const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 text-center">
      <img
        src={user.avatar || 'https://cdn-icons-png.flaticon.com/512/847/847969.png'}
        alt="Avatar"
        className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
      />
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      {user.bio && (
        <p className="mt-2 text-gray-700 italic whitespace-pre-line">{user.bio}</p>
      )}
    </div>
  );
};

export default ProfileCard;
