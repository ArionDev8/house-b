export class RealEstateErrors extends Error {
  constructor(
    code = 500,
    msg = 'Internal Server Error',
    publicMsg = 'Internal Server Error',
  ) {
    super();
    this.code = code;
    this.msg = msg;
    this.publicMsg = publicMsg;
  }

  static fromJoiError(error) {
    const errorMsg = error.details
      .map((detail) => {
        return detail.message;
      })
      .join('\n');
    return new JoiValidationError(400, error, errorMsg);
  }
}

class JoiValidationError extends RealEstateErrors {
  constructor(...args) {
    super(...args);
  }
}
