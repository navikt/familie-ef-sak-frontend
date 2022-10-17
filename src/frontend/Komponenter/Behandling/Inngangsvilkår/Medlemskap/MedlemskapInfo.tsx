import * as React from 'react';
import { FC, useState } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import Statsborgerskap from './Statsborgerskap';
import Oppholdstillatelse from './Oppholdstillatelse';
import Utenlandsopphold from './Utenlandsopphold';
import { IMedlemskap } from './typer';
import FolkeregisterPersonstatus from './FolkeregisterPersonstatus';
import InnflyttingUtflytting from './InnflyttingUtflytting';
import Etikett from 'nav-frontend-etiketter';
import UnntakIMedl from './UnntakIMedl';
import UtvidPanel from '../../../../Felles/UtvidPanel/UtvidPanel';

interface Props {
    medlemskap: IMedlemskap;
    skalViseSøknadsdata: boolean;
}

const MedlemskapInfo: FC<Props> = ({ medlemskap, skalViseSøknadsdata }) => {
    const { registergrunnlag, søknadsgrunnlag } = medlemskap;
    const { oppholdstatus, medlUnntak, innflytting, utflytting } = registergrunnlag;
    const finnesOppholdsstatus = oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadsgrunnlag && søknadsgrunnlag.utenlandsopphold.length > 0;
    const finnesInnflyttingUtflytting = innflytting.length > 0 || utflytting.length > 0;
    const finnesUnntakIMedl = medlUnntak.gyldigeVedtaksPerioder.length > 0;
    const [åpentPanel, settÅpentPanel] = useState(false);

    return (
        <>
            <GridTabell>
                {skalViseSøknadsdata && søknadsgrunnlag && (
                    <>
                        <Søknadsgrunnlag />
                        <Normaltekst>Har bodd i Norge siste 5 år</Normaltekst>
                        <BooleanTekst value={søknadsgrunnlag.bosattNorgeSisteÅrene} />
                    </>
                )}
                {finnesUnntakIMedl && (
                    <>
                        <Registergrunnlag />
                        <Normaltekst>Medlemskapstatus i MEDL</Normaltekst>
                        <Etikett type="fokus">Innslag funnet</Etikett>
                    </>
                )}
            </GridTabell>

            <UtvidPanel
                åpen={åpentPanel}
                knappTekst={åpentPanel ? 'Lukk info om medlemskap' : 'Vis info om medlemskap'}
                onClick={() => settÅpentPanel(!åpentPanel)}
                position={'left'}
            >
                {finnesUnntakIMedl && (
                    <UnntakIMedl gyldigeVedtaksPerioder={medlUnntak.gyldigeVedtaksPerioder} />
                )}
                <Statsborgerskap statsborgerskap={registergrunnlag.statsborgerskap} />
                <FolkeregisterPersonstatus status={registergrunnlag.folkeregisterpersonstatus} />
                {finnesOppholdsstatus && (
                    <Oppholdstillatelse oppholdsstatus={registergrunnlag.oppholdstatus} />
                )}

                {finnesInnflyttingUtflytting && (
                    <InnflyttingUtflytting
                        innflytting={registergrunnlag.innflytting}
                        utflytting={registergrunnlag.utflytting}
                    />
                )}

                {skalViseSøknadsdata && finnesUtenlandsperioder && (
                    <Utenlandsopphold utenlandsopphold={søknadsgrunnlag.utenlandsopphold} />
                )}
            </UtvidPanel>
        </>
    );
};

export default MedlemskapInfo;
