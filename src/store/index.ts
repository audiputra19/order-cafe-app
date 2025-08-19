import { combineReducers, configureStore } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import DarkModeSlice from './DarkModeSlice'
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import { useDispatch, type TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['darkMode']
}

const rootReducer = combineReducers({
    darkMode: DarkModeSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;