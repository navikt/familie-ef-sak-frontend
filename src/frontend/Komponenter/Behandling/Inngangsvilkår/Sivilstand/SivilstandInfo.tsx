import React, { FC } from 'react';
import { ISivilstandInngangsvilkår } from './typer';
import { sivilstandTilTekst } from '../../../../App/typer/personopplysninger';
import { Søknadsinformasjon } from './Søknadsinformasjon';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../vilkår';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { LenkeTilPersonopplysningsside } from '../../../../Felles/Lenker/LenkeTilPersonopplysningsside';
import { BodyShort } from '@navikt/ds-react';
import styled from 'styled-components';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const VerdiWrapper = styled.div`
    display: flex;
    gap: 0.5rem;
`;

const SivilstandInfo: FC<Props> = ({ sivilstand, skalViseSøknadsdata, dokumentasjon }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;

    const gyldigFraOgMedTekst = registergrunnlag.gyldigFraOgMed
        ? ` (${formaterIsoDato(registergrunnlag.gyldigFraOgMed)})`
        : '';

    return (
        <InformasjonContainer>
            <Informasjonsrad
                ikon={VilkårInfoIkon.REGISTER}
                label="Sivilstatus"
                verdiSomString={false}
                verdi={
                    <VerdiWrapper>
                        <BodyShort size={'small'}>
                            {sivilstandTilTekst[registergrunnlag.type]}
                        </BodyShort>
                        <LenkeTilPersonopplysningsside personIdent={registergrunnlag.personIdent}>
                            {registergrunnlag.navn}
                        </LenkeTilPersonopplysningsside>
                        <BodyShort size={'small'}>{gyldigFraOgMedTekst}</BodyShort>
                    </VerdiWrapper>
                }
            />
            {skalViseSøknadsdata && søknadsgrunnlag && (
                <Søknadsinformasjon
                    sivilstandtype={registergrunnlag.type}
                    søknad={søknadsgrunnlag}
                />
            )}
            {skalViseSøknadsdata && (
                <>
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.uformeltGift}
                        tittel={'Dokumentasjon på inngått ekteskap'}
                    />
                    <DokumentasjonSendtInn
                        dokumentasjon={dokumentasjon?.uformeltSeparertEllerSkilt}
                        tittel={'Dokumentasjon på separasjon eller skilsmisse'}
                    />
                </>
            )}
        </InformasjonContainer>
    );
};

export default SivilstandInfo;
