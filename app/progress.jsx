// app/progress.jsx
import { useEffect, useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { loadTasks } from '../src/storage/taskStorage';
import { loadCategories } from '../src/storage/categoryStorage';
import { BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      setTasks(await loadTasks());
      setCategories(await loadCategories());
    })();
  }, []);

  // Ringkasan dasar
  const { doneCount, todoCount, avgProgress } = useMemo(() => {
    const d = tasks.filter(t => t.status === 'done').length;
    const total = tasks.length || 1;
    const avg = Math.round(
      tasks.reduce((acc, t) => acc + (typeof t.progress === 'number' ? t.progress : 0), 0) / total
    );
    return { doneCount: d, todoCount: tasks.length - d, avgProgress: avg };
  }, [tasks]);

  // Data bar chart: Done vs In Progress
  const barData = useMemo(() => ({
    labels: ['Done', 'In Progress'],
    datasets: [{ data: [doneCount, todoCount] }]
  }), [doneCount, todoCount]);

  // Distribusi per kategori (PieChart)
  const pieData = useMemo(() => {
    // hitung jumlah task per kategori
    const counts = new Map();
    for (const t of tasks) {
      const key = t.category ?? 'Umum';
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    // pad dengan kategori yang belum ada task → nilai 0 (agar legend lengkap)
    for (const c of categories) if (!counts.has(c.key)) counts.set(c.key, 0);

    // ambil warna dari storage kategori jika ada
    const colorOf = (key) => categories.find(c => c.key === key)?.color || '#64748b';

    // convert ke array untuk PieChart (hanya tampilkan slice > 0 agar jelas)
    const arr = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({
        name,
        population: value,
        color: colorOf(name),
        legendFontColor: '#0f172a',
        legendFontSize: 12
      }));
    // Jika semua 0 (belum ada task), tampilkan satu slice dummy
    return arr.some(x => x.population > 0)
      ? arr
      : [{ name: 'Belum ada data', population: 1, color: '#e2e8f0', legendFontColor: '#0f172a', legendFontSize: 12 }];
  }, [tasks, categories]);

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(15, 23, 42, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
    propsForBackgroundLines: { strokeDasharray: '', stroke: '#e2e8f0' },
    barPercentage: 0.6,
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={styles.header}>Progress – Ringkasan</Text>

      <View style={styles.card}>
        <Text style={styles.kpiTitle}>Rata-rata Progress</Text>
        <Text style={styles.kpiValue}>{avgProgress}%</Text>
        <Text style={styles.kpiSub}>Dari seluruh task</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Status Tugas</Text>
        <BarChart
          width={screenWidth - 32}
          height={220}
          data={barData}
          chartConfig={chartConfig}
          fromZero
          style={{ borderRadius: 12 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Distribusi per Kategori</Text>
        <PieChart
          width={screenWidth - 32}
          height={240}
          data={pieData}
          accessor="population"
          chartConfig={chartConfig}
          backgroundColor="transparent"
          paddingLeft="0"
          hasLegend
          center={[0, 0]}
        />
      </View>

      <Text style={styles.note}>
        Tip: Tingkatkan progress lewat tab Edit (slider 0–100) pada tiap task. Grafik ini akan ikut
        berubah sesuai data terbaru.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 4 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0',
    padding: 12, gap: 8
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  kpiTitle: { fontSize: 12, fontWeight: '700', color: '#475569' },
  kpiValue: { fontSize: 28, fontWeight: '900', color: '#0f172a' },
  kpiSub: { fontSize: 12, color: '#64748b' },
  note: { color: '#475569', fontSize: 12, marginBottom: 24 }
});
