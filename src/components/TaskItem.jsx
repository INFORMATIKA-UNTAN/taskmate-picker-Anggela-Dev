import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Komponen TaskItem menerima props: task, onToggle, onDelete
export default function TaskItem({ task, onToggle, onDelete }) {
  const isDone = task.status === 'done'; // cek apakah status Done

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      {/* Bagian teks bisa diklik → toggle status */}
      <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1 }}>
        <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>
        {!!task.description && <Text style={styles.desc}>{task.description}</Text>}
        <Text style={styles.meta}>{task.category ?? 'Umum'}</Text>
      </TouchableOpacity>

      {/* Tombol hapus */}
      <TouchableOpacity
        onPress={() => onDelete?.(task)}
        style={styles.deleteBtn}
      >
        <Text style={{ fontSize: 18 }}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

// Style
const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardDone: { backgroundColor: '#f1f5f9' },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4, color: '#0f172a' },
  strike: { textDecorationLine: 'line-through', color: '#64748b' },
  desc: { color: '#475569', marginBottom: 6 },
  meta: { fontSize: 12, color: '#64748b' },

  // 🔧 tambahan style tombol hapus
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
});
