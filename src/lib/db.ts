import { openDB } from 'idb';

const DB_NAME = 'amor-clicks';
const STORE_NAME = 'clicks';

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveClickOffline(username: string) {
  const db = await getDB();
  await db.add(STORE_NAME, { username, timestamp: new Date().toISOString() });
}

export async function getOfflineClicks() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function clearOfflineClicks() {
  const db = await getDB();
  await db.clear(STORE_NAME);
}