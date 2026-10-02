// An error that carries an HTTP status code back to the client.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
