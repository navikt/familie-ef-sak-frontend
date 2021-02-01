import React, { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { Registergrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { IAleneomsorgInngangsvilkår } from './typer';

interface Props {
    aleneomsorg: IAleneomsorgInngangsvilkår[];
    vilkårStatus: VilkårStatus;
    barneId?: string;
}
const AleneomsorgVisning: FC<Props> = ({ aleneomsorg, vilkårStatus, barneId }) => {
    const { registergrunnlag, søknadsgrunnlag } = aleneomsorg.find((it) => it.barneId === barneId);

    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Aleneomsorg</Undertittel>
                    <EtikettLiten>§15-4</EtikettLiten>
                </div>

                <Registergrunnlag />
                <Normaltekst>{registergrunnlag.navn}</Normaltekst>
                <Normaltekst>....</Normaltekst>
            </StyledTabell>
        </>
    );
};

export default AleneomsorgVisning;
