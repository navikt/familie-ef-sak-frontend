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
import VilkårOppfylt from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { IMedlemskap } from '../Medlemskap/typer';
import Statsborgerskap from '../Medlemskap/Statsborgerskap';
import Oppholdsstatus from '../Medlemskap/Oppholdsstatus';
import Utenlandsopphold from '../Medlemskap/Utenlandsopphold';

interface Props {
    medlemskap: IMedlemskap;
    erOppfylt: boolean;
}

const OppholdVisning: FC<Props> = ({ medlemskap, erOppfylt }) => {
    const { registergrunnlag, søknadsgrunnlag } = medlemskap;

    const finnesOppholdsstatus = registergrunnlag.oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadsgrunnlag.utenlandsopphold.length > 0;

    return (
        <>
            <StyledTabell>
                <VilkårOppfylt erOppfylt={erOppfylt} />
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

                <Søknadsgrunnlag />
                <Normaltekst>Har bodd i Norge siste tre år</Normaltekst>
                <BooleanTekst value={søknadsgrunnlag.bosattNorgeSisteÅrene} />
            </StyledTabell>

            <StyledLesmerpanel>
                <Lesmerpanel
                    apneTekst={'Vis info om medlemskap'}
                    lukkTekst={'Lukk info om medlemskap'}
                >
                    <Statsborgerskap statsborgerskap={registergrunnlag.statsborgerskap} />
                    {finnesOppholdsstatus && (
                        <Oppholdsstatus oppholdsstatus={registergrunnlag.oppholdstatus} />
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
