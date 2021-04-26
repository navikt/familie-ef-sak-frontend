import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import vilkårSlice from '../komponenter/Behandling/vilkårSlice';

export const store = configureStore({
    reducer: {
        vilkår: vilkårSlice.reducer,
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
