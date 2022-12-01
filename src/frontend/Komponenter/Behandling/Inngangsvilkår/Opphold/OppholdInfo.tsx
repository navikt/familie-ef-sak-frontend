import * as React from 'react';
import { FC, useState } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import { IMedlemskap } from '../Medlemskap/typer';
import Oppholdstillatelse from '../Medlemskap/Oppholdstillatelse';
import Utenlandsopphold from '../Medlemskap/Utenlandsopphold';
import InnflyttingUtflytting from '../Medlemskap/InnflyttingUtflytting';
import FolkeregisterPersonstatus from '../Medlemskap/FolkeregisterPersonstatus';
import UtvidPanel from '../../../../Felles/UtvidPanel/UtvidPanel';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    medlemskap: IMedlemskap;
    skalViseSøknadsdata: boolean;
}

const OppholdInfo: FC<Props> = ({ medlemskap, skalViseSøknadsdata }) => {
    const { registergrunnlag, søknadsgrunnlag } = medlemskap;

    const finnesOppholdsstatus = registergrunnlag.oppholdstatus.length > 0;
    const finnesUtenlandsperioder = søknadsgrunnlag && søknadsgrunnlag.utenlandsopphold.length > 0;
    const finnesInnflyttingUtflytting =
        registergrunnlag.innflytting.length > 0 || registergrunnlag.utflytting.length > 0;
    const [åpentPanel, settÅpentPanel] = useState(false);

    return (
        <>
            <GridTabell>
                <Registergrunnlag />
                <BodyShortSmall>Statsborgerskap</BodyShortSmall>
                <BodyShortSmall>
                    {registergrunnlag.nåværendeStatsborgerskap.join(', ')}
                </BodyShortSmall>

                {skalViseSøknadsdata && søknadsgrunnlag && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Søker og barn oppholder seg i Norge</BodyShortSmall>
                        <BooleanTekst value={søknadsgrunnlag.oppholderDuDegINorge} />
                    </>
                )}
            </GridTabell>

            <UtvidPanel
                åpen={åpentPanel}
                knappTekst={åpentPanel ? 'Lukk info om opphold' : 'Vis info om opphold'}
                onClick={() => settÅpentPanel(!åpentPanel)}
                position={'left'}
            >
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
export default OppholdInfo;
