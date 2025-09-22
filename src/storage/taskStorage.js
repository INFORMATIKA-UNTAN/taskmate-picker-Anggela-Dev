import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'TASKMATE_TASKS';

// Load semua task
export async function loadTasks() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Simpan semua task
export async function saveTasks(tasks) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
  } catch {}
}

// Hapus semua task
export async function clearTasks() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {}
}

// [BARU] Ambil 1 task berdasarkan id
export async function getTaskById(id) {
  const tasks = await loadTasks();
  return tasks.find(t => t.id === id) || null;
}

// [BARU] Update task berdasarkan id (merge fields)
export async function updateTask(id, patch) {
  const tasks = await loadTasks();
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return false;

  const updated = { ...tasks[idx], ...patch };
  tasks[idx] = updated;

  await saveTasks(tasks);
  return true;
}
