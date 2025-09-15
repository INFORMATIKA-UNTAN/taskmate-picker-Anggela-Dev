// Import React hook untuk state dan efek samping
import { useState, useCallback } from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet, View, TouchableOpacity } from 'react-native'; // 🔧 tambah View & TouchableOpacity
import TaskItem from '../src/components/TaskItem';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import { useFocusEffect } from 'expo-router';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all'); // 🔧 tambahan

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await loadTasks();
        setTasks(data);
      })();
    }, [])
  );

  const handleToggle = async (task) => {
    const updated = tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
        : t
    );
    setTasks(updated);
    await saveTasks(updated);
  };

  const handleDelete = async (task) => {
    const updated = tasks.filter((t) => t.id !== task.id);
    setTasks(updated);
    await saveTasks(updated);
  };

  // 🔧 filter logic sederhana
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'done') return t.status === 'done';
    if (filter === 'todo') return t.status === 'pending'; // todo = pending
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      {/* 🔧 filter buttons */}
      <View style={styles.filterRow}>
        {['all', 'todo', 'pending', 'done'].map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
          >
            <Text style={filter === f ? styles.filterTextActive : styles.filterText}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks} // 🔧 ganti tasks → filteredTasks
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={handleToggle} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },

  // 🔧 tambahan style buat filter
  filterRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 4,
  },
  filterBtnActive: { backgroundColor: '#3b82f6' },
  filterText: { color: '#0f172a', fontWeight: '500' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
});
