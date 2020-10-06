import * as React from 'react';
import { IMedlemskap } from '../vilkår';
import { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import GrønnHake from '../../../../ikoner/GrønnHake';
import Advarsel from '../../../../ikoner/Advarsel';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
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
import { StyledSkillelinje } from '../../../Felleskomponenter/Visning/StyledSkillelinje';

interface Props {
    medlemskap: IMedlemskap;
    className?: string;
}
const MedlemskapVisning: FC<Props> = ({ medlemskap, className }) => {
    const erVurdert = false;

    const { registerGrunnlag, søknadGrunnlag } = medlemskap;

    const finnesOppholdsstatus = registerGrunnlag.oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadGrunnlag.utenlandsopphold.length > 0;

    return (
        <div className={className}>
            <StyledTabell>
                {erVurdert ? <GrønnHake /> : <Advarsel />}
                <Undertittel className="tittel">Medlemskap</Undertittel>

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
            <StyledSkillelinje />
        </div>
    );
};
export default MedlemskapVisning;
