import React, { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Normaltekst } from 'nav-frontend-typografi';
import { Registergrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import { ISivilstandInngangsvilkår } from './typer';
import { sivilstandTilTekst } from '../../../../App/typer/personopplysninger';
import Søknadsinformasjon from './Søknadsinformasjon';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import DokumentasjonSendtInn from '../DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../vilkår';

interface Props {
    sivilstand: ISivilstandInngangsvilkår;
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const SivilstandInfo: FC<Props> = ({ sivilstand, skalViseSøknadsdata, dokumentasjon }) => {
    const { registergrunnlag, søknadsgrunnlag } = sivilstand;
    return (
        <>
            <GridTabell>
                <Registergrunnlag />
                <Normaltekst>Sivilstatus</Normaltekst>
                <Normaltekst>
                    {sivilstandTilTekst[registergrunnlag.type]}
                    {registergrunnlag.navn && ` - ${registergrunnlag.navn}`}
                    {registergrunnlag.gyldigFraOgMed &&
                        ` (${formaterIsoDato(registergrunnlag.gyldigFraOgMed)})`}
                </Normaltekst>

                {skalViseSøknadsdata && søknadsgrunnlag && (
                    <Søknadsinformasjon
                        sivilstandtype={registergrunnlag.type}
                        søknad={søknadsgrunnlag}
                    />
                )}
            </GridTabell>
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
        </>
    );
};

export default SivilstandInfo;
