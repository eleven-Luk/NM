import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

// Generate token with 1 day expiration
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

export const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser){
            return res.status(400).json({ message: 'User already exist with this email'});
        }
        
        const user = await User.create({
            username, 
            email,
            password
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration'
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }
        
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user){
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        const isMatchPassword = await user.comparePassword(password);
        if (!isMatchPassword){
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token directly - NO OTP required
        const token = generateToken(user._id, user.role);
        
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

export const resendOTP = async (req, res) => {
    // OTP is disabled - return error or success message
    return res.status(400).json({
        success: false,
        message: 'OTP verification is disabled'
    });
};

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        res.status(200).json({
            message: 'User profile retrieved successfully',
            user
        });

    } catch (error) {
        console.error('Get Profile error:', error);
        res.status(500).json({
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};