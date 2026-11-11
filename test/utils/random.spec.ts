import { RandomUtils } from '@domain/utils/random';
import { Test, TestingModule } from '@nestjs/testing';

describe('RandomUtils', () => {
    // ================================
    // тестируем метод generateNumber
    it('generateNumber - Should return number', () => {
        const result = RandomUtils.generateNumber(0, 10);

        expect(result).toBeDefined();
        expect(typeof result).toBe('number');
    });

    it('generateNumber - Should generate number within range', () => {
        const min: number = 0;
        const max: number = 100;

        const result = RandomUtils.generateNumber(min, max);

        expect(result).toBeGreaterThanOrEqual(min);
        expect(result).toBeLessThanOrEqual(max);
    });

    it('generateNumber - Should generate unique numbers', () => {
        const min: number = 0;
        const max: number = 1000;

        const iterations: number = 10;

        const results: number[] = [];

        for (let i = 0; i < iterations; i++) {
            results.push(RandomUtils.generateNumber(min, max));
        }

        const uniqueValues: number[] = [...new Set(results)];

        expect(uniqueValues.length).toBe(results.length);
    });

    // ================================
    // тестируем метод generateString
    it('generateString - Should return string', () => {
        const result = RandomUtils.generateString(10);

        expect(result).toBeDefined();
        expect(result.length).toBeDefined();
        expect(typeof result).toBe('string');
    });

    it('generateString - Should generate string with specific length', () => {
        const length: number = 10;

        const result = RandomUtils.generateString(10);

        expect(result.length).toBe(length);
    });

    it('generateString - Should generate unique strings', () => {
        const str_length: number = 5;
        const iterations: number = 10;

        const results: string[] = [];

        for (let i = 0; i < iterations; i++) {
            results.push(RandomUtils.generateString(str_length));
        }

        const uniqueValues: string[] = [...new Set(results)];

        expect(uniqueValues.length).toBe(results.length);
    });
});