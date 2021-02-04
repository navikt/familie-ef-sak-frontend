import React, { FC } from 'react';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { IInngangsvilkårGrunnlag } from '../vilkår';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';

interface Props {
    vilkårStatus: VilkårStatus;
    grunnlag: IInngangsvilkårGrunnlag;
}

const NyttBarnVisning: FC<Props> = ({ vilkårStatus }) => {
    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Nytt barn med samme partner</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>
                <Registergrunnlag />
                <Normaltekst>Brukers barn registrert i folkeregisteret</Normaltekst>
                <Søknadsgrunnlag />
                <Normaltekst>Brukers nåværende eller fremtidige barn lagt til i søknad</Normaltekst>
                <Registergrunnlag />
                <Normaltekst>Brukers stønadshistorikk</Normaltekst>
            </StyledTabell>
        </>
    );
};

export default NyttBarnVisning;
