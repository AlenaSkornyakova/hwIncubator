export class BlogNotFoundError extends Error {
  constructor() {
    super('Blog not found');
    this.name = 'BlogNotFoundError';
  }
}