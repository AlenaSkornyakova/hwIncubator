
export function generateBasicAuthHeader(username: string, password: string) {
  const base64 = Buffer.from(`${username}:${password}`).toString('base64');
  return `Basic ${base64}`;
}