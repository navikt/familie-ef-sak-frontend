import {
    IVilkårGrunnlag,
    IVurdering,
    OppdaterVilkårsvurdering,
    SvarPåVilkårsvurdering,
    Vurderingsfeilmelding,
} from './vilkår';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { Samværsavtale } from '../../../App/typer/samværsavtale';

export interface VilkårProps {
    vurderinger: IVurdering[];
    grunnlag: IVilkårGrunnlag;
    lagreVurdering: (
        vurdering: SvarPåVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    ikkeVurderVilkår: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    nullstillVurdering: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    feilmeldinger: Vurderingsfeilmelding;
    skalViseSøknadsdata: boolean;
}

export interface VilkårPropsMedBehandling extends VilkårProps {
    behandling: Behandling;
}

export interface VilkårPropsAleneomsorg extends VilkårPropsMedBehandling {
    lagredeSamværsavtaler: Samværsavtale[];
    lagreSamværsavtale: (avtale: Samværsavtale) => void;
    slettSamværsavtale: (behandlingId: string, behandlingBarnId: string) => void;
}
