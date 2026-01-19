import { ADD_TASK, SET_TASKS, TOGGLE_TASK, REMOVE_TASK } from '../actions/taskActions';

const initialState = {
  tasks: [],
};

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };

    case SET_TASKS:
      return { ...state, tasks: action.payload };

    case TOGGLE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload
            ? { ...task, completed: !task.completed, syncStatus: 'pending', updatedAt: Date.now() }
            : task
        ),
      };

    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
      };

    default:
      return state;
  }
}
