'use strict';

// Local mitigation for GHSA-vfj7-8cjw-p6xm. The upstream recursive AST
// walkers can overflow the process stack on deeply nested brace patterns.
const MAX_DEPTH = 128;

const assertDepth = ast => {
  const pending = [{ node: ast, depth: 0 }];
  const seen = new Set();

  while (pending.length > 0) {
    const { node, depth } = pending.pop();
    if (!node || typeof node !== 'object') continue;
    if (seen.has(node)) {
      throw new SyntaxError('Cyclic brace AST');
    }
    seen.add(node);

    if (depth > MAX_DEPTH) {
      throw new SyntaxError(`Brace nesting exceeds maximum depth (${MAX_DEPTH})`);
    }

    if (Array.isArray(node.nodes)) {
      for (const child of node.nodes) {
        pending.push({ node: child, depth: depth + 1 });
      }
    }
  }
};

module.exports = { MAX_DEPTH, assertDepth };
