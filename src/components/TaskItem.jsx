import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function deadlineLabel(deadline) {
  const today = new Date();
  const due = new Date(deadline);
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24)); // selisih hari

  if (diff < 0) {
    return <Text style={{ color: 'red' }}>Overdue</Text>;
  }
  if (diff === 0) {
    return <Text style={{ color: 'orange' }}>Hari ini</Text>;
  }
  return <Text style={{ color: 'green' }}>Sisa {diff} hari</Text>;
}
// Komponen TaskItem menerima props: task, onToggle, onDelete
export default function TaskItem({ task, categories, onToggle, onDelete }) {
  const isDone = task.status === 'done';

  // Warna badge ambil dari util sesuai kategori & prioritas
  const catColor = colorOfName(task.category ?? 'Umum', categories);
  const prioColor = colorOfPriority(task.priority ?? 'Low');

  // Warna background card sesuai prioritas
  let priorityBg = '#f3f4f6'; // default abu-abu muda
  switch ((task.priority ?? '').toLowerCase()) {
    case 'high':
      priorityBg = '#ffe4e6'; // merah muda
      break;
    case 'medium':
      priorityBg = '#fef9c3'; // kuning muda
      break;
    case 'low':
      priorityBg = '#e5e7eb'; // abu-abu muda
      break;
  }

  // progress 0-100 → jika tidak ada, tidak dirender
  const pct =
    typeof task.progress === 'number'
      ? Math.max(0, Math.min(100, task.progress))
      : null;

  return (
    <View style={[styles.card, isDone && styles.cardDone, { backgroundColor: priorityBg }]}>
      {/* Toggle status Done/Pending */}
      <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1 }}>
        <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>

        {!!task.deadline && (
  <View style={{ marginBottom: 4 }}>
    <Text style={styles.deadline}>Deadline: {task.deadline}</Text>
    {deadlineLabel(task.deadline)}
  </View>
)}

        {!!task.description && (
          <Text style={styles.desc}>{task.description}</Text>
        )}

        {/* Badge kategori & prioritas */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <View
            style={[
              styles.badge,
              { borderColor: catColor, backgroundColor: `${catColor}20` },
            ]}
          >
            <Text style={[styles.badgeText, { color: catColor }]}>
              {task.category ?? 'Umum'}
            </Text>
          </View>
          <View
            style={[
              styles.badge,
              { borderColor: prioColor, backgroundColor: `${prioColor}20` },
            ]}
          >
            <Text style={[styles.badgeText, { color: prioColor }]}>
              {task.priority ?? 'Low'}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        {pct !== null && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressBar, { width: `${pct}%` }]} />
            <Text style={styles.progressText}>{pct}%</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Hapus task */}
      <Button title="🗑" onPress={() => onDelete?.(task)} />
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
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
