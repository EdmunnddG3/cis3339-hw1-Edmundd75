
const { test } = require('node:test');
const assert = require('node:assert/strict');

const API_URL = 'http://localhost:3000';

test('GET /list-students returns a list successfully', async () => {
    const response = await fetch(`${API_URL}/list-students`);

    assert.equal(response.status, 200);

    const students = await response.json();
    assert.ok(Array.isArray(students));
});

test('GET /list-courses returns a list successfully', async () => {
    const response = await fetch(`${API_URL}/list-courses`);

    assert.equal(response.status, 200);

    const courses = await response.json();
    assert.ok(Array.isArray(courses));
});
