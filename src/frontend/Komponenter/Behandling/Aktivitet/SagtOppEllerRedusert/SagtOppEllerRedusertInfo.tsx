import * as React from 'react';
import { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';

import { ISagtOppEllerRedusertStilling } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import {
    ESagtOppEllerRedusert,
    SagtOppEllerRedusertTilTekst,
} from '../../Inngangsvilkår/Samliv/typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import { BodyLongSmall, BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    sagtOppEllerRedusert: ISagtOppEllerRedusertStilling;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const SagtOppEllerRedusertInfo: FC<Props> = ({ sagtOppEllerRedusert, dokumentasjon }) => {
    const { sagtOppEllerRedusertStilling, årsak, dato } = sagtOppEllerRedusert;
    return (
        <>
            <GridTabell>
                {sagtOppEllerRedusert.sagtOppEllerRedusertStilling ? (
                    <>
                        <HarSagtOppEllerRedusertStilling
                            sagtOppEllerRedusertStilling={sagtOppEllerRedusertStilling}
                            årsak={årsak}
                            dato={dato}
                        />
                    </>
                ) : (
                    <BodyLongSmall className="tekstUtenIkon">
                        Spørsmålet om søker har sagt opp jobben eller redusert arbeidstiden har ikke
                        blitt stilt i søknadsdialogen da søker opplyser at hun/han jobber mer enn 50
                        %.
                    </BodyLongSmall>
                )}
            </GridTabell>

            <DokumentasjonSendtInn
                dokumentasjon={dokumentasjon?.reduksjonAvArbeidsforhold}
                tittel={
                    'Dokumentasjon på arbeidsforholdet og årsaken til at du reduserte arbeidstiden'
                }
            />

            <DokumentasjonSendtInn
                dokumentasjon={dokumentasjon?.oppsigelse}
                tittel={'Dokumentasjon på arbeidsforholdet og årsaken til at du sluttet'}
            />
        </>
    );
};

const HarSagtOppEllerRedusertStilling: React.FC<ISagtOppEllerRedusertStilling> = ({
    sagtOppEllerRedusertStilling,
    årsak,
    dato,
}) => {
    const harSagtOpp = sagtOppEllerRedusertStilling === ESagtOppEllerRedusert.sagtOpp;
    const harRedusertStilling =
        sagtOppEllerRedusertStilling === ESagtOppEllerRedusert.redusertStilling;
    return (
        <>
            <Søknadsgrunnlag />
            <BodyShortSmall>
                Har sagt opp jobben eller redusert arbeidstiden de siste 6 måneder
            </BodyShortSmall>
            <BodyShortSmall>
                {sagtOppEllerRedusertStilling &&
                    SagtOppEllerRedusertTilTekst[sagtOppEllerRedusertStilling]}
            </BodyShortSmall>
            {harSagtOpp && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Årsak til oppsigelse</BodyShortSmall>
                    <BodyShortSmall>{årsak}</BodyShortSmall>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Dato for oppsigelse</BodyShortSmall>
                    <BodyShortSmall>{formaterNullableIsoDato(dato)}</BodyShortSmall>
                </>
            )}
            {harRedusertStilling && (
                <>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Årsak redusert arbeidstid</BodyShortSmall>
                    <BodyShortSmall>{årsak}</BodyShortSmall>
                    <Søknadsgrunnlag />
                    <BodyShortSmall>Dato for når arbeidstiden ble redusert</BodyShortSmall>
                    <BodyShortSmall>{formaterNullableIsoDato(dato)}</BodyShortSmall>
                </>
            )}
        </>
    );
};

export default SagtOppEllerRedusertInfo;
