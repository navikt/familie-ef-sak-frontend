import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosRequest } from '../../api/axiosRequest';
import { IVilkår } from './Inngangsvilkår/vilkår';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../typer/ressurs';

export interface CounterState {
    vilkår: Ressurs<IVilkår>;
}

const initialState: CounterState = {
    vilkår: byggTomRessurs(),
};

export const hentVilkårAsync = createAsyncThunk<Ressurs<IVilkår>, { behandlingId: string }>(
    'counter/fetchCount',
    async ({ behandlingId }) => {
        return await axiosRequest<IVilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/vilkar`,
        });
    }
);

export default createSlice({
    name: 'vilkår',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(hentVilkårAsync.pending, (state) => {
                state.vilkår = byggHenterRessurs();
            })
            .addCase(hentVilkårAsync.fulfilled, (state, action) => {
                state.vilkår = action.payload;
            });
    },
});
