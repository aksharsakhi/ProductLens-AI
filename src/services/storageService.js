import localforage from 'localforage';

/**
 * Enterprise Data Persistence Layer using IndexedDB
 * Ensures catalog data, rules, and user sessions survive page reloads.
 */

localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'ProductLensAI_Enterprise',
  version: 1.0,
  storeName: 'catalog_store',
  description: 'Enterprise catalog persistence layer'
});

export const StorageKeys = {
  RECORDS: 'productlens_records',
  RULES: 'productlens_custom_rules',
  AUTH: 'productlens_auth_session',
  AUDIT_LOGS: 'productlens_audit_logs',
};

export async function saveRecords(records) {
  try {
    await localforage.setItem(StorageKeys.RECORDS, records);
  } catch (err) {
    console.error('Failed to save records to IndexedDB', err);
  }
}

export async function loadRecords() {
  try {
    return await localforage.getItem(StorageKeys.RECORDS) || null;
  } catch (err) {
    console.error('Failed to load records from IndexedDB', err);
    return null;
  }
}

export async function saveRules(rules) {
  try {
    await localforage.setItem(StorageKeys.RULES, rules);
  } catch (err) {
    console.error('Failed to save rules', err);
  }
}

export async function loadRules() {
  try {
    return await localforage.getItem(StorageKeys.RULES) || null;
  } catch (err) {
    console.error('Failed to load rules', err);
    return null;
  }
}

export async function saveAuth(session) {
  try {
    await localforage.setItem(StorageKeys.AUTH, session);
  } catch (err) {
    console.error('Failed to save auth', err);
  }
}

export async function loadAuth() {
  try {
    return await localforage.getItem(StorageKeys.AUTH) || null;
  } catch (err) {
    console.error('Failed to load auth', err);
    return null;
  }
}

export async function logoutUser() {
  try {
    await localforage.removeItem(StorageKeys.AUTH);
  } catch (err) {
    console.error('Failed to logout', err);
  }
}

/**
 * Append to system audit log
 */
export async function appendAuditLog(action, user, details) {
  try {
    const logs = await localforage.getItem(StorageKeys.AUDIT_LOGS) || [];
    logs.unshift({
      timestamp: new Date().toISOString(),
      action,
      user: user || 'System',
      details
    });
    // Keep last 1000 logs
    await localforage.setItem(StorageKeys.AUDIT_LOGS, logs.slice(0, 1000));
  } catch (err) {
    console.error('Failed to append audit log', err);
  }
}

export async function loadAuditLogs() {
  try {
    return await localforage.getItem(StorageKeys.AUDIT_LOGS) || [];
  } catch (err) {
    return [];
  }
}
