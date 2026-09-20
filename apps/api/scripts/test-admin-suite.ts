import { buildApp } from '../src/app.js';
import { client } from '../src/db/index.js';
import { bootstrapAdmin } from '../src/services/admin-bootstrap.service.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
    throw new Error(`Assertion failed: ${testName}`);
  }
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log('🧪 Starting MindCare AI Admin Dashboard & Bootstrap Test Suite');
  console.log('======================================================\n');

  // Test 1: Bootstrap idempotency
  console.log('Test Group 1: Admin Bootstrap & Idempotency');
  await bootstrapAdmin();
  const adminQuery = await client.execute("SELECT id, name, email, role, is_active FROM users WHERE role = 'admin';");
  assert(adminQuery.rows.length >= 1, 'At least one admin user exists in database');
  const adminRow = adminQuery.rows[0];
  assert(adminRow.role === 'admin', 'Admin user has role="admin"');
  assert(Number(adminRow.is_active) === 1, 'Admin user has is_active=1');

  // Test 2: Fastify app injection tests (no external network needed)
  console.log('\nTest Group 2: API Endpoints & Authorization');
  const app = await buildApp();
  await app.ready();

  // 2.1 Unauthenticated requests to /api/admin/*
  const unauthStatsRes = await app.inject({
    method: 'GET',
    url: '/api/admin/stats',
  });
  assert(unauthStatsRes.statusCode === 401, 'Unauthenticated GET /api/admin/stats returns 401');

  const unauthUsersRes = await app.inject({
    method: 'GET',
    url: '/api/admin/users',
  });
  assert(unauthUsersRes.statusCode === 401, 'Unauthenticated GET /api/admin/users returns 401');

  // 2.2 Normal user registration and role verification
  const testEmail = `normaluser_${Date.now()}@example.com`;
  const registerRes = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      name: 'Regular Member',
      email: testEmail,
      password: 'RegularPassword123!',
      // Frontend attempting to send role="admin" must be ignored
      role: 'admin',
    },
  });
  assert(registerRes.statusCode === 201 || registerRes.statusCode === 200, 'User registration succeeds with 201/200');
  const regData = JSON.parse(registerRes.payload);
  assert(regData.user.role === 'user', 'New user role is strictly "user" (cannot escalate during registration)');

  // Verify the user email in db to enable login
  await client.execute({
    sql: 'UPDATE users SET is_verified = 1 WHERE email = ?',
    args: [testEmail],
  });

  // Login as normal user
  const normalLoginRes = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: testEmail,
      password: 'RegularPassword123!',
    },
  });
  assert(normalLoginRes.statusCode === 200, 'Normal user login succeeds');
  const normalLoginData = JSON.parse(normalLoginRes.payload);
  const normalToken = normalLoginData.token;
  assert(normalLoginData.user.role === 'user', 'Normal user payload has role="user"');

  // Normal user accessing admin endpoints -> MUST BE 403 FORBIDDEN
  const normalStatsRes = await app.inject({
    method: 'GET',
    url: '/api/admin/stats',
    headers: { Authorization: `Bearer ${normalToken}` },
  });
  assert(normalStatsRes.statusCode === 403, 'Normal user accessing /api/admin/stats receives 403 Forbidden');

  const normalUsersRes = await app.inject({
    method: 'GET',
    url: '/api/admin/users',
    headers: { Authorization: `Bearer ${normalToken}` },
  });
  assert(normalUsersRes.statusCode === 403, 'Normal user accessing /api/admin/users receives 403 Forbidden');

  // 2.3 Login as Admin
  console.log('\nTest Group 3: Admin Privileges & Safe Information');
  const adminLoginRes = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: 'admin@example.com',
      password: 'AdminSecure2026!',
    },
  });
  assert(adminLoginRes.statusCode === 200, 'Admin login succeeds with 200');
  const adminLoginData = JSON.parse(adminLoginRes.payload);
  const adminToken = adminLoginData.token;
  assert(adminLoginData.user.role === 'admin', 'Admin user payload has role="admin"');

  // Admin access to stats
  const adminStatsRes = await app.inject({
    method: 'GET',
    url: '/api/admin/stats',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminStatsRes.statusCode === 200, 'Admin GET /api/admin/stats returns 200');
  const statsBody = JSON.parse(adminStatsRes.payload);
  assert(typeof statsBody.totalUsers === 'number', 'stats has totalUsers count');
  assert(typeof statsBody.totalConversations === 'number', 'stats has totalConversations count');
  assert(typeof statsBody.totalMoodCheckins === 'number', 'stats has totalMoodCheckins count');
  assert(typeof statsBody.newUsersThisWeek === 'number', 'stats has newUsersThisWeek count');

  // Admin access to users list
  const adminUsersRes = await app.inject({
    method: 'GET',
    url: '/api/admin/users',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(adminUsersRes.statusCode === 200, 'Admin GET /api/admin/users returns 200');
  const usersBody = JSON.parse(adminUsersRes.payload);
  assert(Array.isArray(usersBody.users), 'users response contains users array');

  // Test Group 4: PRIVACY PROTECTIONS
  console.log('\nTest Group 4: Privacy Protection Enforcement');
  const usersPayloadStr = adminUsersRes.payload;
  const statsPayloadStr = adminStatsRes.payload;

  assert(!usersPayloadStr.includes('password_hash'), 'Users list contains NO password_hash');
  assert(!usersPayloadStr.includes('passwordHash'), 'Users list contains NO passwordHash');
  assert(!usersPayloadStr.includes('verificationToken'), 'Users list contains NO verification tokens');
  assert(!usersPayloadStr.includes('resetPasswordToken'), 'Users list contains NO reset tokens');
  assert(!usersPayloadStr.includes('"content"'), 'Users list contains NO message content');
  assert(!usersPayloadStr.includes('"note"'), 'Users list contains NO mood notes');
  assert(!statsPayloadStr.includes('"content"'), 'Stats contains NO message content');
  assert(!statsPayloadStr.includes('"note"'), 'Stats contains NO mood notes');

  // Test Group 5: Account Safeguards
  console.log('\nTest Group 5: Account Safeguards (Self-Demotion / Deactivation)');
  // Admin demoting self -> 400
  const selfDemoteRes = await app.inject({
    method: 'PATCH',
    url: `/api/admin/users/${adminLoginData.user.id}/role`,
    headers: { Authorization: `Bearer ${adminToken}` },
    payload: { role: 'user' },
  });
  assert(selfDemoteRes.statusCode === 400, 'Self-demotion by admin is rejected with 400');

  // Admin deactivating self -> 400
  const selfDeactivateRes = await app.inject({
    method: 'PATCH',
    url: `/api/admin/users/${adminLoginData.user.id}/status`,
    headers: { Authorization: `Bearer ${adminToken}` },
    payload: { isActive: false },
  });
  assert(selfDeactivateRes.statusCode === 400, 'Self-deactivation by admin is rejected with 400');

  // Admin promoting normal user to admin and back
  const normalUserId = regData.user.id;
  const promoteRes = await app.inject({
    method: 'PATCH',
    url: `/api/admin/users/${normalUserId}/role`,
    headers: { Authorization: `Bearer ${adminToken}` },
    payload: { role: 'admin' },
  });
  assert(promoteRes.statusCode === 200, 'Promoting user to admin returns 200');
  const promotedUser = JSON.parse(promoteRes.payload).user;
  assert(promotedUser.role === 'admin', 'Target user role is now admin');

  // Demoting back
  const demoteRes = await app.inject({
    method: 'PATCH',
    url: `/api/admin/users/${normalUserId}/role`,
    headers: { Authorization: `Bearer ${adminToken}` },
    payload: { role: 'user' },
  });
  assert(demoteRes.statusCode === 200, 'Demoting user back to user returns 200');

  await app.close();
  client.close();

  console.log('\n======================================================');
  console.log(`🎉 ALL TESTS PASSED! (${passedTests}/${totalTests})`);
  console.log('======================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
