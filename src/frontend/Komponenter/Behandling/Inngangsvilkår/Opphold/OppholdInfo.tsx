import * as React from 'react';
import { FC } from 'react';
import { IMedlemskap } from '../Medlemskap/typer';
import Oppholdstillatelse from '../Medlemskap/Oppholdstillatelse';
import Utenlandsopphold from '../Medlemskap/Utenlandsopphold';
import InnflyttingUtflytting from '../Medlemskap/InnflyttingUtflytting';
import FolkeregisterPersonstatus from '../Medlemskap/FolkeregisterPersonstatus';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { mapTrueFalse } from '../../../../App/utils/formatter';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';

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

    return (
        <InformasjonContainer>
            <Informasjonsrad
                label="Statsborgerskap"
                verdi={registergrunnlag.nåværendeStatsborgerskap.join(', ')}
                ikon={VilkårInfoIkon.REGISTER}
            />
            {skalViseSøknadsdata && søknadsgrunnlag && (
                <Informasjonsrad
                    label="Søker og barn oppholder seg i Norge"
                    verdi={mapTrueFalse(søknadsgrunnlag.oppholderDuDegINorge)}
                    ikon={VilkårInfoIkon.SØKNAD}
                />
            )}

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
export default OppholdInfo;
