import Crypto from 'crypto';

export class RandomUtils {
    static generateNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static generateString(n: number): string {
        const randomString: string = Crypto.randomBytes(n).toString('hex');
        return randomString.slice(0, n);
    }
}