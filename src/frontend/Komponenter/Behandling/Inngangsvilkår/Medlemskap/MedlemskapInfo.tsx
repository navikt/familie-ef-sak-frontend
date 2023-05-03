import * as React from 'react';
import { FC } from 'react';
import Statsborgerskap from './Statsborgerskap';
import Oppholdstillatelse from './Oppholdstillatelse';
import Utenlandsopphold from './Utenlandsopphold';
import { IMedlemskap } from './typer';
import FolkeregisterPersonstatus from './FolkeregisterPersonstatus';
import InnflyttingUtflytting from './InnflyttingUtflytting';
import UnntakIMedl from './UnntakIMedl';
import { InformasjonContainer, TagMedTilpassetBredde } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { mapTrueFalse } from '../../../../App/utils/formatter';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

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
        <InformasjonContainer>
            {skalViseSøknadsdata && søknadsgrunnlag && (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Har bodd i Norge siste 5 år"
                        verdi={mapTrueFalse(søknadsgrunnlag.bosattNorgeSisteÅrene)}
                    />
                    {søknadsgrunnlag.oppholdsland && (
                        <Informasjonsrad
                            ikon={VilkårInfoIkon.SØKNAD}
                            label="Oppholdsland"
                            verdi={søknadsgrunnlag.oppholdsland}
                        />
                    )}
                </>
            )}
            {finnesUnntakIMedl && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label="Medlemskapstatus i MEDL"
                    verdi={
                        <TagMedTilpassetBredde variant={'warning'} size="small">
                            Innslag funnet
                        </TagMedTilpassetBredde>
                    }
                    verdiSomString={false}
                />
            )}

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
        </InformasjonContainer>
    );
};

export default MedlemskapInfo;
