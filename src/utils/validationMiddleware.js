import { RealEstateErrors } from './ErrorHandler.js';
import jwt from 'jsonwebtoken';

export function validate(what, dto) {
  return async function (req, res, next) {
    // console.log(req.query);
    try {
      req[what] = await dto.validateAsync(req[what]);
      next();
    } catch (err) {
      next(RealEstateErrors.fromJoiError(err));
    }
  };
}

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Access denied, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
