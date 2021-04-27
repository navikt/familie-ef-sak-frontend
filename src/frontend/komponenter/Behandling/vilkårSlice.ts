import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosRequest } from '../../api/axiosRequest';
import { IVilkår } from './Inngangsvilkår/vilkår';
import { byggHenterRessurs, byggTomRessurs, Ressurs } from '../../typer/ressurs';

export interface VilkårState {
    vilkårsressurs: Ressurs<IVilkår>;
}

const initialState: VilkårState = {
    vilkårsressurs: byggTomRessurs(),
};

export const hentVilkårAsync = createAsyncThunk<Ressurs<IVilkår>, { behandlingId: string }>(
    'vilkår/hentVilkår',
    async ({ behandlingId }) => {
        return await axiosRequest<IVilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/vilkar`,
        });
    }
);

export default createSlice({
    name: 'vilkårsressurs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(hentVilkårAsync.pending, (state) => {
                state.vilkårsressurs = byggHenterRessurs();
            })
            .addCase(hentVilkårAsync.fulfilled, (state, action) => {
                state.vilkårsressurs = action.payload;
            });
    },
});
