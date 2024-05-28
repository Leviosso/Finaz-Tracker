const request = require('supertest');
const app = require('./server'); // Pfad zu Ihrer server.js Datei

describe('Teste den Root-Pfad', () => {
    test('Es sollte die GET-Methode antworten', async () => {
        const response = await request(app).get('/api/transactions');
        expect(response.statusCode).toBe(200);
    });
});