import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'TASKS';

export const getTasks = async () => {
  const data = await AsyncStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = async tasks => {
  await AsyncStorage.setItem(KEY, JSON.stringify(tasks));
};
