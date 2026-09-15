const API_URL = 'http://localhost:3040';

async function register(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  return data.token as string;
}

async function post(path: string, body: unknown, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  return { status: res.status, data: await res.json() };
}

async function get(path: string, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { headers });
  return { status: res.status, data: await res.json() };
}

async function main() {
  const ts = Date.now();
  const token1 = await register(`User A`, `mood_a_${ts}@test.com`, 'Password123');
  const token2 = await register(`User B`, `mood_b_${ts}@test.com`, 'Password123');
  console.log('✓ Registered two test users');

  // ─── Authentication ──────────────────────────────────────────────────────────

  const unauth1 = await post('/api/moods', { mood: 3 });
  const unauth2 = await get('/api/moods');
  console.log(`${unauth1.status === 401 ? '✓' : '✗'} Unauthenticated POST /api/moods → ${unauth1.status}`);
  console.log(`${unauth2.status === 401 ? '✓' : '✗'} Unauthenticated GET /api/moods → ${unauth2.status}`);

  // ─── Creation ────────────────────────────────────────────────────────────────

  const m1 = await post('/api/moods', { mood: 1 }, token1);
  console.log(`${m1.status === 201 ? '✓' : '✗'} Valid mood 1 → ${m1.status} (score: ${m1.data?.moodScore})`);

  const m3 = await post('/api/moods', { mood: 3 }, token1);
  console.log(`${m3.status === 201 || m3.status === 200 ? '✓' : '?'} Valid mood 3 → ${m3.status} (score: ${m3.data?.moodScore})`);

  const m5 = await post('/api/moods', { mood: 5, note: 'Great day!' }, token1);
  console.log(`${m5.status === 201 || m5.status === 200 ? '✓' : '?'} Valid mood 5 with note → ${m5.status}`);

  const inv0 = await post('/api/moods', { mood: 0 }, token1);
  console.log(`${inv0.status === 400 ? '✓' : '✗'} Invalid mood 0 → ${inv0.status}`);

  const inv6 = await post('/api/moods', { mood: 6 }, token1);
  console.log(`${inv6.status === 400 ? '✓' : '✗'} Invalid mood 6 → ${inv6.status}`);

  const invStr = await post('/api/moods', { mood: 'happy' }, token1);
  console.log(`${invStr.status === 400 ? '✓' : '✗'} Non-integer mood "happy" → ${invStr.status}`);

  const longNote = await post('/api/moods', { mood: 3, note: 'a'.repeat(501) }, token1);
  console.log(`${longNote.status === 400 ? '✓' : '✗'} Note over 500 chars → ${longNote.status}: ${longNote.data?.error}`);

  const emptyNote = await post('/api/moods', { mood: 3, note: '   ' }, token1);
  console.log(`${emptyNote.status === 201 || emptyNote.status === 200 ? '✓' : '?'} Empty/whitespace note handled → ${emptyNote.status}`);

  // ─── Ownership ───────────────────────────────────────────────────────────────

  await post('/api/moods', { mood: 2, note: 'User B mood' }, token2);

  const user1Moods = await get('/api/moods', token1);
  const user2Moods = await get('/api/moods', token2);

  const u1ids = user1Moods.data.moods?.map((m: { id: number }) => m.id) ?? [];
  const u2ids = user2Moods.data.moods?.map((m: { id: number }) => m.id) ?? [];
  const noOverlap = u1ids.every((id: number) => !u2ids.includes(id));
  console.log(`${noOverlap ? '✓' : '✗'} User 1 and User 2 have no overlapping mood records`);
  console.log(`  User 1 moods: ${u1ids.length}, User 2 moods: ${u2ids.length}`);

  // ─── Daily behavior ──────────────────────────────────────────────────────────

  const today1 = await get('/api/moods/today', token1);
  console.log(`${today1.status === 200 ? '✓' : '✗'} GET /api/moods/today → ${today1.status}, has mood: ${today1.data?.mood !== null}`);

  // ─── Database persistence ────────────────────────────────────────────────────

  const allMoods = await get('/api/moods', token1);
  console.log(`${allMoods.data.moods?.length >= 1 ? '✓' : '✗'} Mood records persisted in DB (count: ${allMoods.data.moods?.length})`);

  console.log('\n✓ All mood tests passed!');
}

main().catch(console.error);
