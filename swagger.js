import { writeFileSync } from 'node:fs';
import swaggerSpec from './src/docs/swagger.js';

writeFileSync('./swagger.json', `${JSON.stringify(swaggerSpec, null, 2)}\n`);
console.log('Swagger documentation generated.');