// Import React hook untuk state dan efek samping
import { useState, useCallback } from 'react';
import TaskItem from '../src/components/TaskItem';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import { useFocusEffect } from 'expo-router';
import { useEffect, useState, useMemo } from 'react';
import {
  SafeAreaView,
  Text,
  SectionList,
  FlatList,
  StyleSheet,
  View,
  Button,
  Alert,
} from 'react-native';
import TaskItem from '../src/components/TaskItem.jsx';
import FilterToolbarFancy from '../src/components/FilterToolbarFancy.jsx';
import AddCategoryModal from '../src/components/AddCategoryModal.jsx';
import { loadTasks, saveTasks, clearTasks } from '../src/storage/taskStorage';
import { loadCategories, saveCategories } from '../src/storage/categoryStorage';
import { pickColor } from '../src/constants/categories';
import { weightOfPriority } from '../src/constants/priorities';

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

// [GROUP] ubah tasks jadi per kategori
const sections = useMemo(() => {
  const groups = {};
  for (const t of filteredTasks) {
    const cat = t.category || 'Umum';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(t);
  }
  return Object.keys(groups).map((cat) => ({
    title: cat,
    data: groups[cat],
  }));
}, [filteredTasks]);


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

      {/* [LIST] Tugas tersortir */}
      <SectionList
  sections={sections}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ padding: 16 }}
  renderItem={({ item }) => (
    <TaskItem
      task={item}
      categories={categories}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  )}
  renderSectionHeader={({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  )}
  ListEmptyComponent={
    <Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>
  }
/>


      {/* [OPSIONAL] Modal tambah kategori dari Home */}
      <AddCategoryModal
        visible={showCatModal}
        onClose={() => setShowCatModal(false)}
        onSubmit={handleSubmitCategory}
        suggestedColor={pickColor(categories.length)}
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
  toolbarText: { fontWeight: '600', color: '#334155' },
  sectionHeader: {
  fontSize: 16,
  fontWeight: '700',
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: '#f1f5f9',
  color: '#0f172a',
  marginTop: 12,
  borderRadius: 8,
},

});
