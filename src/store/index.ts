import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import DarkModeSlice from './DarkModeSlice';
import CartSlice from './CartSlice';
import AuthSlice from './AuthSlice';
import { persistReducer } from 'redux-persist';
import { persistStore } from 'redux-persist';
import { useDispatch, type TypedUseSelectorHook } from 'react-redux';
import { useSelector } from 'react-redux';
import { apiProduct } from '../services/apiProduct';
import { apiAuth } from '../services/apiAuth';
import { apiPayment } from '../services/apiPayment';
import { apiOrder } from '../services/apiOrder';
import { apiProfile } from '../services/apiProfile';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['darkMode', 'cart', 'auth']
}

const rootReducer = combineReducers({
    darkMode: DarkModeSlice,
    cart: CartSlice,
    auth: AuthSlice,
    [apiProduct.reducerPath]: apiProduct.reducer,
    [apiAuth.reducerPath]: apiAuth.reducer,
    [apiPayment.reducerPath]: apiPayment.reducer,
    [apiOrder.reducerPath]: apiOrder.reducer,
    [apiProfile.reducerPath]: apiProfile.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(
            apiProduct.middleware,
            apiAuth.middleware,
            apiPayment.middleware,
            apiOrder.middleware,
            apiProfile.middleware
        )
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;