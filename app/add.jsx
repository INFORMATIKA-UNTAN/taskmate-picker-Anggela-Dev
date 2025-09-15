// Import React hook
import { useState } from 'react';
// Komponen UI bawaan
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// Import helper storage
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
// UUID untuk id unik
import { v4 as uuidv4 } from 'uuid';
// Expo Router untuk navigasi antar halaman
import { useRouter } from 'expo-router';

export default function Add() {
  const router = useRouter(); // router untuk navigasi
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Handler saat tombol "Tambah Tugas" ditekan
  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul tugas tidak boleh kosong!');
      return;
    }
    // Ambil data lama dari storage
    const tasks = await loadTasks();

    // Buat task baru
    const newTask = {
      id: uuidv4(),
      title,
      description: desc,
      category: 'Umum',
      deadline: '2025-09-30',
      status: 'pending',
    };

    // Gabungkan dengan data lama
    const updated = [...tasks, newTask];
    await saveTasks(updated); // Simpan ke storage

    // Reset form & kembali ke Home
    setTitle('');
    setDesc('');
    router.replace('/'); // navigasi balik ke index (Home)
  };

  // Tampilan UI
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Tugas</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Contoh: Tugas Mobile"
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={desc}
        onChangeText={setDesc}
        placeholder="Deskripsi singkat"
        multiline
      />

      <Button title="Simpan Tugas" onPress={handleAdd} />
    </View>
  );
}

// Style
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  label: { marginTop: 12, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
});
