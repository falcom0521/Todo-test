
import { takeLatest, call, put } from 'redux-saga/effects';
import { SYNC_TASKS, TOGGLE_TASK, REMOVE_TASK, setTasks } from '../actions/taskActions';
import { getTasks, saveTasks } from '../../storage/taskStorage';
import api from '../../api/api';
import NetInfo from '@react-native-community/netinfo';

function* syncTasksSaga() {
  try {
    const tasks = yield call(getTasks);
    const pendingTasks = tasks.filter(t => t.syncStatus === 'pending');

    if (pendingTasks.length === 0) {
      console.log('✅ [Sync] No pending tasks to sync');
      return;
    }

    console.log(`🔄 [Sync] Starting sync for ${pendingTasks.length} pending task(s)`);
    console.log('📋 [Sync] Pending tasks:', pendingTasks.map(t => ({ id: t._id, title: t.title })));

    for (let task of pendingTasks) {
      try {
        console.log(`📤 [Sync] Posting task: "${task.title}" (ID: ${task._id})`);
        // Only send title, description, completed, and updatedAt to backend
        const taskToSync = {
          title: task.title,
          description: task.description,
          completed: task.completed,
          updatedAt: task.updatedAt,
        };
        const response = yield call(api.post, '/tasks', taskToSync);
        console.log(`✅ [Sync] Task synced successfully: "${task.title}" (Server ID: ${response.data._id})`);
        task._id = response.data._id;
        task.syncStatus = 'synced';
      } catch (error) {
        console.error(`❌ [Sync] Failed to sync task "${task.title}":`, error.message);
      }
    }

    yield call(saveTasks, tasks);
    yield put(setTasks(tasks));
    console.log('✅ [Sync] All tasks synced and saved locally');
  } catch (error) {
    console.error('❌ [Sync] Sync saga error:', error);
  }
}

function* toggleTaskSaga(action) {
  try {
    const tasks = yield call(getTasks);
    const updatedTasks = tasks.map(task =>
      task._id === action.payload
        ? { ...task, completed: !task.completed, syncStatus: 'pending', updatedAt: Date.now() }
        : task
    );
    const toggledTask = updatedTasks.find(t => t._id === action.payload);
    console.log(`📝 [Task] Toggled task: "${toggledTask.title}" - ${toggledTask.completed ? 'Completed ✓' : 'Incomplete'}`);
    
    yield call(saveTasks, updatedTasks);
    yield put(setTasks(updatedTasks));
    
    // Check if network is available and sync immediately
    const state = yield call(NetInfo.fetch);
    if (state.isConnected) {
      console.log('🌐 [Network] Online - syncing toggled task');
      yield call(syncTasksSaga);
    } else {
      console.log('📴 [Network] Offline - task marked as pending');
    }
  } catch (error) {
    console.error('❌ [Task] Toggle task saga error:', error);
  }
}

function* removeTaskSaga(action) {
  try {
    const tasks = yield call(getTasks);
    const removedTask = tasks.find(t => t._id === action.payload);
    const updatedTasks = tasks.filter(task => task._id !== action.payload);
    console.log(`🗑️ [Task] Deleted task: "${removedTask?.title}"`);
    
    yield call(saveTasks, updatedTasks);
    yield put(setTasks(updatedTasks));
  } catch (error) {
    console.error('❌ [Task] Remove task saga error:', error);
  }
}

export default function* taskSaga() {
  yield takeLatest(SYNC_TASKS, syncTasksSaga);
  yield takeLatest(TOGGLE_TASK, toggleTaskSaga);
  yield takeLatest(REMOVE_TASK, removeTaskSaga);
}
