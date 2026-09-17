const API_URL = 'http://localhost:3040';

async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Registration failed (${res.status}): ${JSON.stringify(data)}`);
  }
  return { token: data.token as string, user: data.user };
}

async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function patch(path: string, body: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });
  return { status: res.status, data: await res.json() };
}

async function get(path: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { headers });
  return { status: res.status, data: await res.json() };
}

async function runTests() {
  console.log('--- Starting Profile & Account Settings Tests ---');
  const ts = Date.now();
  const user1 = await register('Initial User One', `user1_${ts}@test.com`, 'OldPassword123');
  const user2 = await register('User Two', `user2_${ts}@test.com`, 'User2Password123');
  console.log('✓ Registered two test users');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✓ ${msg}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Unauthenticated PATCH /api/auth/me → 401
  const unauthMe = await patch('/api/auth/me', { name: 'Hacker' });
  assert(unauthMe.status === 401, `Unauthenticated PATCH /api/auth/me returns 401 (got ${unauthMe.status})`);

  // 2. Unauthenticated PATCH /api/auth/password → 401
  const unauthPwd = await patch('/api/auth/password', { currentPassword: 'foo', newPassword: 'bar' });
  assert(unauthPwd.status === 401, `Unauthenticated PATCH /api/auth/password returns 401 (got ${unauthPwd.status})`);

  // 3. Authenticated user can update their own name
  const updateRes = await patch('/api/auth/me', { name: 'Updated First Name' }, user1.token);
  assert(updateRes.status === 200, `Authenticated PATCH /api/auth/me returns 200 (got ${updateRes.status})`);
  assert(updateRes.data?.user?.name === 'Updated First Name', `Returned name is updated: "${updateRes.data?.user?.name}"`);
  assert(!('password' in updateRes.data.user) && !('passwordHash' in updateRes.data.user), 'Response does NOT contain password or passwordHash');

  // 4. Verify updated name persists in database via GET /api/auth/me
  const verifyMe = await get('/api/auth/me', user1.token);
  assert(verifyMe.status === 200 && verifyMe.data?.user?.name === 'Updated First Name', `GET /api/auth/me confirms persisted name: "${verifyMe.data?.user?.name}"`);

  // 5. Empty name → 400
  const emptyName = await patch('/api/auth/me', { name: '   ' }, user1.token);
  assert(emptyName.status === 400, `Empty name returns 400 (got ${emptyName.status})`);

  // 6. Name exceeding 100 chars → 400
  const longName = await patch('/api/auth/me', { name: 'a'.repeat(101) }, user1.token);
  assert(longName.status === 400, `Name over 100 characters returns 400 (got ${longName.status})`);

  // 7. Authorization: Passing arbitrary fields or attempts to spoof id or email
  const spoofAttempt = await patch('/api/auth/me', { id: user2.user.id, email: 'spoofed@evil.com', name: 'Valid Name' }, user1.token);
  assert(spoofAttempt.status === 200, `PATCH succeeds with valid name ignoring spoofed fields (got ${spoofAttempt.status})`);
  assert(spoofAttempt.data?.user?.id === user1.user.id, `User ID remains unchanged (still ${user1.user.id})`);
  assert(spoofAttempt.data?.user?.email === `user1_${ts}@test.com`, `Email remains unchanged`);

  // Verify User 2 was NOT affected
  const verifyUser2 = await get('/api/auth/me', user2.token);
  assert(verifyUser2.data?.user?.name === 'User Two', 'User 2 name remains unaffected by User 1 actions');

  // 8. Password change: missing current password → 400
  const missingCurrent = await patch('/api/auth/password', { newPassword: 'BrandNewPassword123' }, user1.token);
  assert(missingCurrent.status === 400, `Missing current password returns 400 (got ${missingCurrent.status})`);

  // 9. Password change: invalid new password (< 6 chars) → 400
  const shortNew = await patch('/api/auth/password', { currentPassword: 'OldPassword123', newPassword: '123' }, user1.token);
  assert(shortNew.status === 400, `Short new password (<6 chars) returns 400 (got ${shortNew.status})`);

  // 10. Password change: incorrect current password → 400 with friendly message
  const wrongCurrent = await patch('/api/auth/password', { currentPassword: 'WrongPassword!', newPassword: 'BrandNewPassword123' }, user1.token);
  assert(wrongCurrent.status === 400, `Incorrect current password returns 400 (got ${wrongCurrent.status})`);
  assert(wrongCurrent.data?.error === 'The current password is incorrect', `Error message is exact: "${wrongCurrent.data?.error}"`);

  // 11. Correct current password + valid new password → succeeds 200
  const validChange = await patch('/api/auth/password', { currentPassword: 'OldPassword123', newPassword: 'BrandNewPassword123' }, user1.token);
  assert(validChange.status === 200, `Valid password change returns 200 (got ${validChange.status})`);
  assert(validChange.data?.message === 'Your password has been changed successfully.', `Success message confirmed: "${validChange.data?.message}"`);
  assert(!('password' in validChange.data) && !('passwordHash' in validChange.data), 'Response does not contain password or hash');

  // 12. Old password no longer works for login
  const oldLogin = await login(`user1_${ts}@test.com`, 'OldPassword123');
  assert(oldLogin.status === 401, `Login with old password fails with 401 (got ${oldLogin.status})`);

  // 13. New password actually works for login
  const newLogin = await login(`user1_${ts}@test.com`, 'BrandNewPassword123');
  assert(newLogin.status === 200, `Login with new password succeeds with 200 (got ${newLogin.status})`);
  assert(newLogin.data?.user?.id === user1.user.id, `Logged in user id matches original user`);

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
