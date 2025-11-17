#!/usr/bin/env ts-node

import { generateTestToken } from '../src/utils/jwtHelper';

const userId = process.argv[2] || 'user123';

const token = generateTestToken(userId);

console.log('\n=== JWT Token Generated ===');
console.log(`User ID: ${userId}`);
console.log(`Token: ${token}`);
console.log('\nUse this token in the Authorization header:');
console.log(`Authorization: Bearer ${token}\n`);

