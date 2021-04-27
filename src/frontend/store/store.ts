import { configureStore } from '@reduxjs/toolkit';
import vilkårSlice from '../komponenter/Behandling/vilkårSlice';
import endreVilkårSlice from '../komponenter/Behandling/endrevilkårSlice';
import { useDispatch, useSelector } from 'react-redux';

export const store = configureStore({
    reducer: {
        vilkår: vilkårSlice.reducer,
        endreVilkår: endreVilkårSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(f: (state: RootState) => T) => useSelector(f);
