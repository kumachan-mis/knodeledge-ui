const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomString(length: number): string {
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}
