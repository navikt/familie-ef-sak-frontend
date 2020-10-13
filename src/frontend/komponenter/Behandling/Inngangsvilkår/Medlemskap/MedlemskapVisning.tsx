import * as React from 'react';
import { FC } from 'react';
import { IMedlemskap } from '../vilkår';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import {
    RegisterGrunnlag,
    SøknadGrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import Statsborgerskap from './Statsborgerskap';
import Oppholdsstatus from './Oppholdsstatus';
import Utenlandsopphold from './Utenlandsopphold';
import { StyledLesmerpanel } from '../../../Felleskomponenter/Visning/StyledNavKomponenter';
import IkkeOppfylt from '../../../../ikoner/IkkeOppfylt';
import Oppfylt from '../../../../ikoner/Oppfylt';

interface Props {
    medlemskap: IMedlemskap;
    erOppfylt: boolean;
}

const MedlemskapVisning: FC<Props> = ({ medlemskap, erOppfylt }) => {
    const { registerGrunnlag, søknadGrunnlag } = medlemskap;

    const finnesOppholdsstatus = registerGrunnlag.oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadGrunnlag.utenlandsopphold.length > 0;

    return (
        <>
            <StyledTabell>
                {erOppfylt ? (
                    <Oppfylt heigth={21} width={21} />
                ) : (
                    <IkkeOppfylt heigth={21} width={21} />
                )}
                <div className="tittel">
                    <Undertittel>Medlemskap og opphold i Norge</Undertittel>
                    <EtikettLiten>§15-2 og §15-3 </EtikettLiten>
                </div>

                <RegisterGrunnlag />
                <Normaltekst>Statsborgerskap</Normaltekst>
                <Normaltekst>{registerGrunnlag.nåværendeStatsborgerskap.join(', ')}</Normaltekst>

                <SøknadGrunnlag />
                <Normaltekst>Søker og barn oppholder seg i Norge</Normaltekst>
                <BooleanTekst value={søknadGrunnlag.oppholderDuDegINorge} />

                <SøknadGrunnlag />
                <Normaltekst>Har bodd i Norge siste tre år</Normaltekst>
                <BooleanTekst value={søknadGrunnlag.bosattNorgeSisteÅrene} />
            </StyledTabell>

            <StyledLesmerpanel>
                <Lesmerpanel
                    apneTekst={'Vis info om medlemskap'}
                    lukkTekst={'Lukk info om medlemskap'}
                >
                    <Statsborgerskap statsborgerskap={registerGrunnlag.statsborgerskap} />
                    {finnesOppholdsstatus && (
                        <Oppholdsstatus oppholdsstatus={registerGrunnlag.oppholdstatus} />
                    )}

                    {finnesUtenlandsperioder && (
                        <Utenlandsopphold utenlandsopphold={søknadGrunnlag.utenlandsopphold} />
                    )}
                </Lesmerpanel>
            </StyledLesmerpanel>
        </>
    );
};
export default MedlemskapVisning;
