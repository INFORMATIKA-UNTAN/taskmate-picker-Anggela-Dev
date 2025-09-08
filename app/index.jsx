import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList, View, TouchableOpacity } from 'react-native';
import TaskItem from '../src/components/TaskItem';
import { dummyTasks } from '../src/data/dummyTasks';

export default function HomeScreen() {
  const [tasks, setTasks] = useState(dummyTasks);
  const [filter, setFilter] = useState("all"); // state filter

  const handleToggle = (task) => {
    setTasks(prev =>
      prev.map(t => t.id === task.id
        ? { ...t, status: t.status === 'done' ? 'pending' : 'done' }
        : t
      )
    );
  };

  //  filter tasks sesuai pilihan tombol
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "todo") return task.status === "pending";
    if (filter === "done") return task.status === "done";
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

      {/*Tombol filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setFilter("all")} style={[styles.filterBtn, filter==="all" && styles.active]}>
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("todo")} style={[styles.filterBtn, filter==="todo" && styles.active]}>
          <Text>Todo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter("done")} style={[styles.filterBtn, filter==="done" && styles.active]}>
          <Text>Done</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTasks} // 🔹 pakai filteredTasks
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TaskItem task={item} onToggle={handleToggle} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '700', padding: 16 },

  //style tombol filter
  filterRow: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
  filterBtn: { padding: 8, marginHorizontal: 5, backgroundColor: "#e2e8f0", borderRadius: 8 },
  active: { backgroundColor: "#a5f3fc" },
});
