// src/components/TaskItem.jsx
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { colorOfName } from '../constants/categories';
import { colorOfPriority } from '../constants/priorities';

// helper deadlineInfo tetap sama (kalau sudah ada)
// ...deadlineInfo(...) di sini...
function deadlineInfo(deadline) {
  if (!deadline) return { status: 'none', text: '' };

  // Normalisasi ke 'YYYY-MM-DD'
  const todayStr = new Date().toISOString().slice(0, 10);

  // Paksa jam 00:00 untuk hindari selisih karena timezone
  const t = new Date(`${todayStr}T00:00:00`);
  const d = new Date(`${deadline}T00:00:00`);

  if (isNaN(d.getTime())) {
    // Jika format deadline tidak valid, anggap tidak ada deadline
    return { status: 'none', text: '' };
  }

  const diffMs = d - t;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) return { status: 'overdue', text: 'Overdue' };
  if (days === 0) return { status: 'today', text: 'Jatuh tempo: Hari ini' };
  return { status: 'future', text: `Sisa ${days} hari` };
}

export default function TaskItem({ task, categories, onToggle, onDelete }) {
  const isDone = task.status === 'done';
  const catColor = colorOfName(task.category ?? 'Umum', categories);
  const prioColor = colorOfPriority(task.priority ?? 'Low');

  // >>> progress: fallback ke 0 bila undefined/null, lalu clamp 0–100
  const raw = typeof task.progress === 'number' ? task.progress : 0;
  const pct = Math.max(0, Math.min(100, raw));

  const router = useRouter();
  const info = deadlineInfo(task.deadline);

  return (
    <View
      style={[
        styles.card,
        isDone && styles.cardDone,
        info.status === 'overdue'
          ? { borderColor: '#fecaca', backgroundColor: '#fff1f2' }
          : info.status === 'future'
          ? { borderColor: '#fde68a', backgroundColor: '#fffbeb' }
          : {},
      ]}
    >
      {/* Ketuk kartu untuk toggle status */}
      <TouchableOpacity onPress={() => onToggle?.(task)} style={{ flex: 1 }}>
        <Text style={[styles.title, isDone && styles.strike]}>
          {task.title}
        </Text>

        {!!task.deadline && (
          <Text
            style={[
              styles.deadline,
              info.status === 'overdue'
                ? { color: '#dc2626', fontWeight: '700' }
                : {},
            ]}
          >
            Deadline: {task.deadline} {info.text ? `• ${info.text}` : ''}
          </Text>
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

        {/* >>> Progress bar biru selalu tampil (0–100) */}
        <View style={styles.progressWrap}>
          <View style={[styles.progressBar, { width: `${pct}%` }]} />
          <Text style={styles.progressText}>{pct}%</Text>
        </View>
      </TouchableOpacity>

      {/* Aksi Edit & Hapus */}
      <View style={{ gap: 6 }}>
        <Button title="Edit" onPress={() => router.push(`/edit/${task.id}`)} />
        <Button title="🗑" onPress={() => onDelete?.(task)} />
      </View>
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

  // >>> progress styles: bar biru + label %
  progressWrap: {
    marginTop: 10,
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  // biru sesuai permintaan (#2563eb)
  progressBar: { height: '100%', backgroundColor: '#2563eb' },
  progressText: {
    position: 'absolute',
    right: 8,
    top: -18,
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
});
