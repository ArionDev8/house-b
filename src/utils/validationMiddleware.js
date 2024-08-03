import { RealEstateErrors } from "./ErrorHandler.js";

export function validate(what, dto) {
    return async function (req, res, next) {
        try {
            req[what] = await dto.validateAsync(req[what])
            next();
        } catch (err) {
            next(RealEstateErrors.fromJoiError(err));
        }
    };
}