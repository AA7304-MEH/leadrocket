import { MockUser } from './src/models/MockUser';
console.log('MockUser imported successfully');
const user = new MockUser({ name: 'Test', email: 'test@test.com', password: 'password' });
console.log('MockUser created:', user.name);
