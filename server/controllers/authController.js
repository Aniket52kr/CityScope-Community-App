import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Register a new user and set JWT via HTTP-only cookie
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create the user
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(user._id);

      // Set HTTP-only cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development', // true in production
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      // Return success response
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('[Auth] Registration failed:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login a user and set JWT as HTTP-only cookie
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });

//     // Validate user and password
//     if (user && (await user.matchPassword(password))) {
//       const token = generateToken(user._id);

//       // Set HTTP-only cookie
//       res.cookie('jwt', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV !== 'development', // HTTPS only in prod
//         sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//       });

//       // Send user data without token
//       return res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//       });
//     } else {
//       return res.status(401).json({ message: 'Invalid email or password' });
//     }
//   } catch (error) {
//     console.error('[Auth] Login failed:', error.message);
//     return res.status(500).json({ message: 'Login failed', error: error.message });
//   }
// };

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set cookie with secure, cross-origin settings
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // true in production
      sameSite: process.env.NODE_ENV === 'development' ? 'Lax' : 'None', // 'None' required for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send user data (exclude password and token)
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

  } catch (error) {
    console.error('[Auth] Login failed:', error.message);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};



// Get current logged-in user profile
export const getCurrentUser = async (req, res) => {
  try {
    // Prevent 304 Not Modified by ensuring fresh data
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');

    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('[Auth] Error fetching user:', error.message);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// Handle logout by clearing JWT cookie
export const logoutUser = async (req, res) => {
  try {
    // Clear cookie by setting maxAge to 0
    res.cookie('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'strict',
      maxAge: 0,
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('[Auth] Error during logout:', error.message);
    res.status(500).json({ message: 'Logout failed' });
  }
};