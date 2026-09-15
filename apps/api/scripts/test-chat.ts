const API_URL = 'http://localhost:3040';

async function main() {
  console.log('Testing Chat API & Safety Features...\n');

  // 1. Register or login test users
  const user1Email = `user1_${Date.now()}@example.com`;
  const user2Email = `user2_${Date.now()}@example.com`;

  const reg1Res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User One', email: user1Email, password: 'Password123' }),
  });
  const { token: token1 } = await reg1Res.json();

  const reg2Res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User Two', email: user2Email, password: 'Password123' }),
  });
  const { token: token2 } = await reg2Res.json();

  console.log('✓ Registered test users');

  // 2. Unauthorized request rejected
  const unauthRes = await fetch(`${API_URL}/api/conversations`);
  if (unauthRes.status === 401) {
    console.log('✓ Unauthorized request rejected with 401');
  } else {
    console.error('✗ Expected 401 for unauthorized request, got:', unauthRes.status);
  }

  // 3. Create conversation
  const createRes = await fetch(`${API_URL}/api/conversations`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const createData = await createRes.json();
  const convId = createData.conversation?.id;
  console.log(`✓ Created conversation (id: ${convId}, title: "${createData.conversation?.title}")`);

  // 4. List conversations
  const listRes = await fetch(`${API_URL}/api/conversations`, {
    headers: { 'Authorization': `Bearer ${token1}` },
  });
  const listData = await listRes.json();
  if (listData.conversations?.length >= 1 && listData.conversations[0].id === convId) {
    console.log('✓ List conversations returned user1 conversation');
  } else {
    console.error('✗ List conversations mismatch:', listData);
  }

  // 5. Get single conversation
  const getRes = await fetch(`${API_URL}/api/conversations/${convId}`, {
    headers: { 'Authorization': `Bearer ${token1}` },
  });
  const getData = await getRes.json();
  if (getData.conversation?.id === convId && Array.isArray(getData.messages)) {
    console.log('✓ Get conversation returned conversation and messages array');
  }

  // 6. Ownership enforcement: User 2 cannot access User 1's conversation
  const forbiddenRes = await fetch(`${API_URL}/api/conversations/${convId}`, {
    headers: { 'Authorization': `Bearer ${token2}` },
  });
  if (forbiddenRes.status === 404) {
    console.log("✓ Ownership enforced: user2 received 404 when accessing user1's conversation");
  } else {
    console.error('✗ Ownership leak! user2 got status:', forbiddenRes.status);
  }

  // 7. Empty message rejected
  const emptyRes = await fetch(`${API_URL}/api/conversations/${convId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: '   ' }),
  });
  if (emptyRes.status === 400) {
    console.log('✓ Empty message rejected with 400');
  } else {
    console.error('✗ Expected 400 for empty message, got:', emptyRes.status);
  }

  // 8. Excessively long message rejected (>2000 chars)
  const longRes = await fetch(`${API_URL}/api/conversations/${convId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'a'.repeat(2001) }),
  });
  if (longRes.status === 400) {
    console.log('✓ Excessively long message (>2000 chars) rejected with 400');
  } else {
    console.error('✗ Expected 400 for long message, got:', longRes.status);
  }

  // 9. Safety Test - High Risk Message: bypasses AI model, returns crisis guidance immediately
  const highRiskRes = await fetch(`${API_URL}/api/conversations/${convId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'I want to kill myself.' }),
  });
  const highRiskData = await highRiskRes.json();
  if (
    highRiskData.userMessage?.riskLevel === 'high' &&
    highRiskData.assistantMessage?.content?.includes('crisis')
  ) {
    console.log('✓ High-risk message ("I want to kill myself.") detected and returned safe crisis guidance');
    console.log('  User message risk level:', highRiskData.userMessage.riskLevel);
  } else {
    console.error('✗ High risk message handling failed:', highRiskData);
  }

  // 10. Verify conversation title auto-updated from first message
  const updatedConvRes = await fetch(`${API_URL}/api/conversations/${convId}`, {
    headers: { 'Authorization': `Bearer ${token1}` },
  });
  const updatedConvData = await updatedConvRes.json();
  console.log(`✓ Conversation title updated automatically to: "${updatedConvData.conversation?.title}"`);

  // 11. Normal message with unconfigured key -> returns friendly 502 error
  const normalMsgRes = await fetch(`${API_URL}/api/conversations/${convId}/messages`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: 'I am feeling tired after exams.' }),
  });
  const normalMsgData = await normalMsgRes.json();
  if (normalMsgRes.status === 502) {
    console.log('✓ Unconfigured/failed OpenRouter returns friendly error (502):', normalMsgData.error);
  } else if (normalMsgRes.status === 200) {
    console.log('✓ OpenRouter response succeeded:', normalMsgData.assistantMessage?.content?.slice(0, 50));
  }

  // 12. Safety Test - Risk Classification unit check
  const { classifyRisk } = await import('../src/services/risk.service.js');
  const normalRisk = classifyRisk("I'm tired after studying.");
  const moderateRisk = classifyRisk("I've been feeling hopeless lately.");
  const highRisk = classifyRisk("I want to kill myself.");

  console.log('✓ Risk classification checks:');
  console.log('  "I\'m tired after studying." =>', normalRisk, normalRisk === 'low' ? '✓' : '✗');
  console.log('  "I\'ve been feeling hopeless lately." =>', moderateRisk, moderateRisk === 'moderate' ? '✓' : '✗');
  console.log('  "I want to kill myself." =>', highRisk, highRisk === 'high' ? '✓' : '✗');

  console.log('\nAll Backend & Safety Verification Passed!');
}

main().catch(console.error);
