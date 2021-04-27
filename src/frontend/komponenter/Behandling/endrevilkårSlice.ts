import { Ressurs, RessursStatus, RessursSuksess } from '../../typer/ressurs';
import { IVurdering, SvarPåVilkårsvurdering } from './Inngangsvilkår/vilkår';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { hentVilkårAsync } from './vilkårSlice';
import { axiosRequest } from '../../api/axiosRequest';

export interface VurderingState {
    vurderinger: IVurdering[];
    status: RessursStatus;
}

const initialState: VurderingState = {
    vurderinger: [],
    status: RessursStatus.IKKE_HENTET,
};

export const oppdaterVilkår = createAsyncThunk<
    Ressurs<IVurdering>,
    { vurdering: SvarPåVilkårsvurdering }
>('vilkår/oppdaterVilkår', async ({ vurdering }, thunkAPI) => {
    const oppdatertvilkår = await axiosRequest<IVurdering, SvarPåVilkårsvurdering>({
        method: 'POST',
        url: `familie-ef-sak/api/vurdering/vilkar`,
        data: vurdering,
    });
    thunkAPI.dispatch(hentVilkårAsync({ behandlingId: vurdering.behandlingId }));

    return oppdatertvilkår;
});

export default createSlice({
    name: 'redigerVilkår',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(hentVilkårAsync.fulfilled, (state, action) => {
            state.vurderinger =
                action.payload.status === RessursStatus.SUKSESS
                    ? action.payload.data.vurderinger
                    : [];
        });
        builder.addCase(oppdaterVilkår.pending, (state) => {
            state.status = RessursStatus.HENTER;
        });
        builder.addCase(oppdaterVilkår.fulfilled, (state, action) => {
            state.status = RessursStatus.SUKSESS;
            state.vurderinger =
                action.payload.status === RessursStatus.SUKSESS
                    ? state.vurderinger.map((v) =>
                          (action.payload as RessursSuksess<IVurdering>).data.id === v.id
                              ? (action.payload as RessursSuksess<IVurdering>).data
                              : v
                      )
                    : state.vurderinger;
        });
    },
});
