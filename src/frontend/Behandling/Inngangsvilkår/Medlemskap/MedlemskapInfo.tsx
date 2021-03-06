import * as React from 'react';
import { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import {
    Registergrunnlag,
    Søknadsgrunnlag,
} from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../Felleskomponenter/Visning/StyledTekst';
import Lesmerpanel from 'nav-frontend-lesmerpanel';
import Statsborgerskap from './Statsborgerskap';
import Oppholdstillatelse from './Oppholdstillatelse';
import Utenlandsopphold from './Utenlandsopphold';
import { StyledLesmerpanel } from '../../../Felleskomponenter/Visning/StyledNavKomponenter';
import { IMedlemskap } from './typer';
import FolkeregisterPersonstatus from './FolkeregisterPersonstatus';
import InnflyttingUtflytting from './InnflyttingUtflytting';
import Etikett from 'nav-frontend-etiketter';
import UnntakIMedl from './UnntakIMedl';

interface Props {
    medlemskap: IMedlemskap;
}

const MedlemskapInfo: FC<Props> = ({ medlemskap }) => {
    const { registergrunnlag, søknadsgrunnlag } = medlemskap;
    const { oppholdstatus, medlUnntak, innflytting, utflytting } = registergrunnlag;
    const finnesOppholdsstatus = oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadsgrunnlag.utenlandsopphold.length > 0;
    const finnesInnflyttingUtflytting = innflytting.length > 0 || utflytting.length > 0;
    const finnesUnntakIMedl = medlUnntak.gyldigeVedtaksPerioder.length > 0;

    return (
        <>
            <GridTabell>
                <Søknadsgrunnlag />
                <Normaltekst>Har bodd i Norge siste 5 år</Normaltekst>
                <BooleanTekst value={søknadsgrunnlag.bosattNorgeSisteÅrene} />
                {finnesUnntakIMedl && (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Medlemskapstatus i MEDL</Normaltekst>
                        <Etikett type="fokus">Innslag funnet</Etikett>
                    </>
                )}
            </GridTabell>

            <StyledLesmerpanel>
                <Lesmerpanel
                    apneTekst={'Vis info om medlemskap'}
                    lukkTekst={'Lukk info om medlemskap'}
                >
                    {finnesUnntakIMedl && (
                        <UnntakIMedl gyldigeVedtaksPerioder={medlUnntak.gyldigeVedtaksPerioder} />
                    )}
                    <Statsborgerskap statsborgerskap={registergrunnlag.statsborgerskap} />
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

export default MedlemskapInfo;
