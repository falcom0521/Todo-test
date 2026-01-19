import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setTasks, syncTasks } from '../redux/actions/taskActions';
import { getTasks, saveTasks } from '../storage/taskStorage';
import TaskItem from '../components/TaskItem';
import uuid from '../utils/uuid';
import useSync from '../hooks/useSync';
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TodoScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const dispatch = useDispatch();
  const tasks = useSelector(state => state.task.tasks);

  useSync();

  useEffect(() => {
    loadTasks();
    checkNetworkStatus();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const checkNetworkStatus = async () => {
    const state = await NetInfo.fetch();
    setIsOnline(state.isConnected);
  };

  const loadTasks = async () => {
    const localTasks = await getTasks();
    dispatch(setTasks(localTasks));
  };

  const onAddTask = async () => {
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    const task = {
      _id: uuid(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      syncStatus: 'pending',
      updatedAt: Date.now(),
    };

    console.log(`📌 [App] New task added: "${task.title}" (ID: ${task._id})`);
    
    const updated = [...tasks, task];
    dispatch(addTask(task));
    await saveTasks(updated);
    setTitle('');
    setDescription('');
    setIsModalVisible(false);

    // Check if network is available and sync immediately
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      console.log('🌐 [App] Network available - syncing new task immediately');
      dispatch(syncTasks());
    } else {
      console.log('📴 [App] Network unavailable - task queued for sync');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity 
          style={styles.plusButton}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialCommunityIcons name="plus" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <TaskItem task={item} />}
        scrollEnabled={true}
        style={styles.taskList}
      />

      {!isOnline && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>You are currently offline</Text>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#d0d0d0" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Task</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.inputSection}>
              <TextInput
                placeholder="Task Title"
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                placeholderTextColor="#bbb"
              />
              <TextInput
                placeholder="Task Description (optional)"
                value={description}
                onChangeText={setDescription}
                style={styles.descriptionInput}
                multiline
                numberOfLines={4}
                placeholderTextColor="#bbb"
              />
            </View>

            <TouchableOpacity 
              style={styles.submitButton}
              onPress={onAddTask}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
  },
  plusButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: '300',
  },
  taskList: {
    flex: 1,
  },
  offlineIndicator: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  offlineText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  closeButton: {
    fontSize: 24,
    color: '#d0d0d0',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#222',
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: '#222',
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
