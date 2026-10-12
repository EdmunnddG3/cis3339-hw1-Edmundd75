
const { test } = require('node:test');
const assert = require('node:assert/strict');

const API_URL = 'http://localhost:3000';

// Test to check if the /list-students endpoint returns a list of students successfully
test('GET /list-students returns a list successfully', async () => {
    const response = await fetch(`${API_URL}/list-students`);

    assert.equal(response.status, 200);

    const students = await response.json();
    assert.ok(Array.isArray(students));
});

// Test to check if the /list-courses endpoint returns a list of courses successfully
test('GET /list-courses returns a list successfully', async () => {
    const response = await fetch(`${API_URL}/list-courses`);

    assert.equal(response.status, 200);

    const courses = await response.json();
    assert.ok(Array.isArray(courses));
});
