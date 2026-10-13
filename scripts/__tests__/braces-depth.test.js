import { describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const braces = createRequire(require.resolve('micromatch'))('braces');

describe('patched braces depth guard', () => {
  it('preserves ordinary compile and expansion', () => {
    expect(braces.compile('a/{b,c}/d')).toBe('a/(b|c)/d');
    expect(braces.expand('a/{b,c}/d')).toEqual(['a/b/d', 'a/c/d']);
  });

  it('rejects deeply nested patterns before recursive walking', () => {
    const nested = '{'.repeat(129) + 'a' + '}'.repeat(129);
    expect(() => braces.compile(nested)).toThrow(/maximum depth/);
    expect(() => braces.expand(nested)).toThrow(/maximum depth/);
  });

  it('rejects deeply nested caller-supplied ASTs', () => {
    let ast = { type: 'text', value: 'a' };
    for (let i = 0; i < 129; i++) ast = { type: 'brace', nodes: [ast] };
    expect(() => braces.compile(ast)).toThrow(/maximum depth/);
  });
});
