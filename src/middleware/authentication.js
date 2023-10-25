const jwt = require('jsonwebtoken');
const wardenModel = require('../models/wardenModel');
const jwtSecret = process.env.JWT_TOKEN;

const authenticateUser = async (req, res, next) => {
    const token = req.header('Authorization');
// console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
    let bearerToken;
    if (typeof token !== 'undefined' && token.startsWith('Bearer ')) {
        // Extract the token from the header (excluding 'Bearer ')
        bearerToken = token.split(' ')[1];
    }

    try {
        const decoded = jwt.verify(bearerToken, jwtSecret);
        const warden = await wardenModel.findById(decoded.user);

        if (!warden) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = warden;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = {
    authenticateUser,
};
