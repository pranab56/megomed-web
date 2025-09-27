import { useDispatch, useSelector } from 'react-redux';
import { store } from './store/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;



// Custom hook for auth state
export const useAuth = () => {
  return useSelector((state) => state.auth);
};

// Custom hook for user state
export const useUser = () => {
  return useSelector((state) => state.user);
};

// Custom hook for chat state
export const useChat = () => {
  return useSelector((state) => state.chat);
};

// Custom hook for getting store state
export const useStore = () => {
  return store.getState();
};
