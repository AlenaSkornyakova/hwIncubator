export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly field?: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);

    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}