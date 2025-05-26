import User from '../models/User.js';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) return res.json(user);
    else return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    console.log('[DEBUG] Update body:', req.body);
    console.log('[DEBUG] Authenticated user:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: req.user not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found in DB' });
    }

    user.name = req.body.name || user.name;
    user.bio = req.body.bio || user.bio;
    user.avatar = req.body.avatar || user.avatar;

    const updatedUser = await user.save();

    const { password, ...userData } = updatedUser.toObject();
    return res.json(userData);
  } catch (error) {
    console.error('[ERROR] Update failed:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
