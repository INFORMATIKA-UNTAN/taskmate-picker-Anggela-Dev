// Import React hook untuk state dan efek samping
import { useState, useCallback } from 'react'; // 🔧 tambah useCallback
// Import komponen bawaan React Native
import { SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';
// Import komponen TaskItem (custom component kita sendiri)
import TaskItem from '../src/components/TaskItem';
// Import helper untuk load & save data ke AsyncStorage
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
// 🔧 import tambahan biar data reload saat halaman fokus
import { useFocusEffect } from 'expo-router';

// Komponen default untuk halaman Home
export default function HomeScreen() {
  // State untuk menyimpan daftar tugas
  const [tasks, setTasks] = useState([]);

  // 🔧 ubah: pakai useFocusEffect agar data reload tiap kali balik ke Home
  useFocusEffect(
    useCallback(() => {
      (async () => {
        // Load data dari AsyncStorage
        const data = await loadTasks();
        // Simpan ke state tasks
        setTasks(data);
      })();
    }, [])
  );

  // Fungsi untuk toggle status tugas (Done ⇆ Pending)
  const handleToggle = async (task) => {
    const updated = tasks.map((t) =>
      t.id === task.id
        ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
        : t
    );
    setTasks(updated); // update state
    await saveTasks(updated); // simpan ke AsyncStorage
  };

  // Fungsi untuk menghapus tugas
  const handleDelete = async (task) => {
    const updated = tasks.filter((t) => t.id !== task.id); // ambil semua kecuali task terpilih
    setTasks(updated);
    await saveTasks(updated);
  };

  // Tampilan UI
  return (
    <SafeAreaView style={styles.container}>
      {/* Judul Halaman */}
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      {/* FlatList = daftar tugas */}
      <FlatList
        data={tasks} // data yang ditampilkan
        keyExtractor={(item) => item.id} // key unik tiap item
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggle} // handler toggle Done/Pending
            onDelete={handleDelete} // handler hapus tugas
          />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center' }}>Tidak ada tugas</Text>
        }
      />
    </SafeAreaView>
  );
}

// Style
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },
});
