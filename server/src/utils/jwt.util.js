import jwt from 'jsonwebtoken';

export const sendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true, // Prevents XSS attacks (JS cannot read the cookie)
        secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
        sameSite: 'strict', // Prevents CSRF
    };

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        user,
    });
};