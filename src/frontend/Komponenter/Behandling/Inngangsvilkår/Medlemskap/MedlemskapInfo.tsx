import * as React from 'react';
import { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { BooleanTekst } from '../../../../Felles/Visningskomponenter/BooleanTilTekst';
import Statsborgerskap from './Statsborgerskap';
import Oppholdstillatelse from './Oppholdstillatelse';
import Utenlandsopphold from './Utenlandsopphold';
import { IMedlemskap } from './typer';
import FolkeregisterPersonstatus from './FolkeregisterPersonstatus';
import InnflyttingUtflytting from './InnflyttingUtflytting';
import UnntakIMedl from './UnntakIMedl';
import { Tag } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

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

    return (
        <>
            <GridTabell>
                {skalViseSøknadsdata && søknadsgrunnlag && (
                    <>
                        <Søknadsgrunnlag />
                        <BodyShortSmall>Har bodd i Norge siste 5 år</BodyShortSmall>
                        <BooleanTekst value={søknadsgrunnlag.bosattNorgeSisteÅrene} />
                    </>
                )}
                {finnesUnntakIMedl && (
                    <>
                        <Registergrunnlag />
                        <BodyShortSmall>Medlemskapstatus i MEDL</BodyShortSmall>
                        <Tag variant={'warning'}>Innslag funnet</Tag>
                    </>
                )}
            </GridTabell>

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
        </>
    );
};

export default MedlemskapInfo;
