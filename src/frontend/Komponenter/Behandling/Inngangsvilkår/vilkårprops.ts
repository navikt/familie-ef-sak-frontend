import {
    IVilkårGrunnlag,
    IVurdering,
    OppdaterVilkårsvurdering,
    SvarPåVilkårsvurdering,
    Vurderingsfeilmelding,
} from './vilkår';
import { RessursFeilet, RessursSuksess } from '../../../App/typer/ressurs';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { BehandlingStatus } from '../../../App/typer/behandlingstatus';

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

export interface VilkårPropsMedStønadstype extends VilkårProps {
    stønadstype: Stønadstype;
    behandlingId: string;
}

export interface VilkårPropsMedBehandlingId extends VilkårProps {
    behandlingId: string;
}

export interface VilkårPropsMedBehandlingsstatus extends VilkårProps {
    behandlingsstatus: BehandlingStatus;
    behandlingId: string;
}

export interface VilkårPropsMedBehandlingOpprettet extends VilkårProps {
    behandlingOpprettet: string;
}
