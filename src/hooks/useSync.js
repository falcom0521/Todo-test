import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { syncTasks } from '../redux/actions/taskActions';

export default function useSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check initial network state
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log('🌐 [Network] Initial check: Online ✓');
        dispatch(syncTasks());
      } else {
        console.log('📴 [Network] Initial check: Offline ✗');
      }
    });

    // Listen for network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('🌐 [Network] Connection established ✓');
        dispatch(syncTasks());
      } else {
        console.log('📴 [Network] Connection lost ✗');
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
}
