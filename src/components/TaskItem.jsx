import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { colorOfName } from '../constants/categories';
import { colorOfPriority } from '../constants/priorities';


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

export default function TaskItem({ task, categories, onToggle, onDelete }) {
  const isDone = task.status === 'done';
  // [UPDATE] Warna badge ambil dari util sesuai kategori & prioritas
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
  // [OPSIONAL] progress 0-100 → jika tidak ada, tidak dirender
  const pct =
    typeof task.progress === 'number'
      ? Math.max(0, Math.min(100, task.progress))
      : null;

  return (
<View style={[styles.card, isDone && styles.cardDone, { backgroundColor: priorityBg }]}>
      {/* [AKSI] Ketuk untuk toggle status Done/Pending */}
      <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1 }}>
        <Text style={[styles.title, isDone && styles.strike]}>{task.title}</Text>

        {!!task.deadline && (
  <View style={{ marginBottom: 4 }}>
    <Text style={styles.deadline}>Deadline: {task.deadline}</Text>
    {deadlineLabel(task.deadline)}
  </View>
)}
        {/* [UPDATE] Badge kategori & prioritas */}
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

        {/* [OPSIONAL] Progress bar tipis */}
        {pct !== null && (
          <View style={styles.progressWrap}>
            <View style={[styles.progressBar, { width: `${pct}%` }]} />
            <Text style={styles.progressText}>{pct}%</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* [AKSI] Hapus task */}
      <Button title="🗑" onPress={() => onDelete?.(task)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    // [STYLE] Shadow lembut
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardDone: { backgroundColor: '#f8fafc' },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 4, color: '#0f172a' },
  strike: { textDecorationLine: 'line-through', color: '#64748b' },
  deadline: { fontSize: 12, color: '#334155', marginBottom: 4 },
  desc: { color: '#475569' },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  progressWrap: {
    marginTop: 10,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: { height: '100%', backgroundColor: '#0f172a' },
  progressText: {
    position: 'absolute',
    right: 8,
    top: -18,
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
});
