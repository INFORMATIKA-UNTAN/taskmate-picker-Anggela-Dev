import { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getTaskById, updateTask } from '../../src/storage/taskStorage';
import { loadCategories } from '../../src/storage/categoryStorage';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { PRIORITIES } from '../../src/constants/priorities';

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [task, setTask] = useState(null);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Umum');
  const [priority, setPriority] = useState('Low');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const t = await getTaskById(id);
      const cats = await loadCategories();
      setCategories(cats);

      if (!t) {
        Alert.alert('Error', 'Task tidak ditemukan');
        router.back();
        return;
      }

      setTask(t);
      setTitle(t.title || '');
      setDesc(t.description || '');
      setDeadline(t.deadline || '');
      setCategory(t.category || 'Umum');
      setPriority(t.priority || 'Low');
      setProgress(typeof t.progress === 'number' ? t.progress : 0);
    })();
  }, [id]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul wajib diisi!');
      return;
    }

    const ok = await updateTask(id, {
      title,
      description: desc,
      deadline,
      category,
      priority,
      progress: Math.round(progress),
    });

    if (!ok) {
      Alert.alert('Error', 'Gagal menyimpan');
      return;
    }

    Alert.alert('Sukses', 'Perubahan disimpan.');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Tugas</Text>

      <Text style={styles.label}>Judul</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Judul"
      />

      <Text style={styles.label}>Deskripsi</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={desc}
        onChangeText={setDesc}
        placeholder="Deskripsi"
        multiline
      />

      <Text style={styles.label}>Deadline (YYYY-MM-DD)</Text>
      <TextInput
        style={styles.input}
        value={deadline}
        onChangeText={setDeadline}
        placeholder="2025-09-30"
      />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={category} onValueChange={setCategory}>
          {categories.map(k => (
            <Picker.Item key={k.key} label={k.key} value={k.key} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Prioritas</Text>
      <View style={styles.pickerWrap}>
        <Picker selectedValue={priority} onValueChange={setPriority}>
          {PRIORITIES.map(p => (
            <Picker.Item key={p} label={p} value={p} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Progress: {Math.round(progress)}%</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={progress}
        onValueChange={setProgress}
      />

      <Button title="Simpan Perubahan" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  label: {
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#fff',
  },
});
