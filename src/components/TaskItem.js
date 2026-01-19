import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { toggleTask, removeTask } from '../redux/actions/taskActions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TaskItem({ task }) {
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(toggleTask(task._id));
  };

  const handleDelete = () => {
    dispatch(removeTask(task._id));
  };

  const syncColor = task.syncStatus === 'synced' ? '#4CAF50' : '#FFC107';
  const syncIcon = task.syncStatus === 'synced' ? 'check-circle' : 'clock-outline';

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.checkbox, task.completed && styles.checkboxChecked]} 
        onPress={handleToggle}
      >
        {task.completed && (
          <MaterialCommunityIcons name="check" size={16} color="white" />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.taskContent} onPress={handleToggle}>
        <Text style={[styles.title, task.completed && styles.completedText]}>
          {task.title}
        </Text>
        {task.description && (
          <Text style={[styles.description, task.completed && styles.completedText]}>
            {task.description}
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.rightSection}>
        <MaterialCommunityIcons 
          name={syncIcon} 
          size={20} 
          color={syncColor} 
          style={styles.syncIcon}
        />
        <TouchableOpacity onPress={handleDelete} style={styles.deleteIcon}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d0d0d0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  taskContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#777',
    marginBottom: 0,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#bbb',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  syncIcon: {
    marginRight: 8,
  },
  deleteIcon: {
    padding: 6,
    marginLeft: 4,
  },
});
