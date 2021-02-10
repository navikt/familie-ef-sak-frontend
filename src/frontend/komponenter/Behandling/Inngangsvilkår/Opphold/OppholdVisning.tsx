import * as React from 'react';
import { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import { StyledLesmerpanel } from '../../../Felleskomponenter/Visning/StyledNavKomponenter';
import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { IMedlemskap } from '../Medlemskap/typer';
import Oppholdstillatelse from '../Medlemskap/Oppholdstillatelse';
import Utenlandsopphold from '../Medlemskap/Utenlandsopphold';
import InnflyttingUtflytting from '../Medlemskap/InnflyttingUtflytting';
import FolkeregisterPersonstatus from '../Medlemskap/FolkeregisterPersonstatus';

interface Props {
    medlemskap: IMedlemskap;
    vilkårStatus: VilkårStatus;
}

const OppholdVisning: FC<Props> = ({ medlemskap, vilkårStatus }) => {
    const { registergrunnlag, søknadsgrunnlag } = medlemskap;

    const finnesOppholdsstatus = registergrunnlag.oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadsgrunnlag.utenlandsopphold.length > 0;
    const finnesInnflyttingUtflytting =
        registergrunnlag.innflytting.length > 0 || registergrunnlag.utflytting.length > 0;

    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Opphold i Norge</Undertittel>
                    <EtikettLiten>§15-3 </EtikettLiten>
                </div>

                <Registergrunnlag />
                <Normaltekst>Statsborgerskap</Normaltekst>
                <Normaltekst>{registergrunnlag.nåværendeStatsborgerskap.join(', ')}</Normaltekst>

                <Søknadsgrunnlag />
                <Normaltekst>Søker og barn oppholder seg i Norge</Normaltekst>
                <BooleanTekst value={søknadsgrunnlag.oppholderDuDegINorge} />
            </StyledTabell>

            <StyledLesmerpanel>
                <Lesmerpanel apneTekst={'Vis info om opphold'} lukkTekst={'Lukk info om opphold'}>
                    <FolkeregisterPersonstatus
                        status={registergrunnlag.folkeregisterpersonstatus}
                    />
                    {finnesOppholdsstatus && (
                        <Oppholdstillatelse oppholdsstatus={registergrunnlag.oppholdstatus} />
                    )}

                    {finnesInnflyttingUtflytting && (
                        <InnflyttingUtflytting
                            innflytting={registergrunnlag.innflytting}
                            utflytting={registergrunnlag.utflytting}
                        />
                    )}

                    {finnesUtenlandsperioder && (
                        <Utenlandsopphold utenlandsopphold={søknadsgrunnlag.utenlandsopphold} />
                    )}
                </Lesmerpanel>
            </StyledLesmerpanel>
        </>
    );
};
export default OppholdVisning;
