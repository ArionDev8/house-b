import { RealEstateErrors } from './ErrorHandler.js';
import jwt from 'jsonwebtoken';

export function validate(what, dto) {
  return async function (req, res, next) {
    try {
      req[what] = await dto.validateAsync(req[what]);
      next();
    } catch (err) {
      next(RealEstateErrors.fromJoiError(err));
    }
  };
}

export const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

