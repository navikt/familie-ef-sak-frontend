import * as React from 'react';
import { FC } from 'react';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Normaltekst } from 'nav-frontend-typografi';

import { ISagtOppEllerRedusertStilling } from '../../../../App/typer/aktivitetstyper';
import { Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import {
    ESagtOppEllerRedusert,
    SagtOppEllerRedusertTilTekst,
} from '../../Inngangsvilkår/Samliv/typer';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';

interface Props {
    sagtOppEllerRedusert: ISagtOppEllerRedusertStilling;
    skalViseSøknadsdata: boolean;
    dokumentasjon?: IDokumentasjonGrunnlag;
}

const SagtOppEllerRedusertInfo: FC<Props> = ({
    sagtOppEllerRedusert,
    skalViseSøknadsdata,
    dokumentasjon,
}) => {
    const { sagtOppEllerRedusertStilling, årsak, dato } = sagtOppEllerRedusert;
    return (
        <>
            <GridTabell>
                {skalViseSøknadsdata &&
                    (sagtOppEllerRedusert.sagtOppEllerRedusertStilling ? (
                        <>
                            <HarSagtOppEllerRedusertStilling
                                sagtOppEllerRedusertStilling={sagtOppEllerRedusertStilling}
                                årsak={årsak}
                                dato={dato}
                            />
                        </>
                    ) : (
                        <Normaltekst className="tekstUtenIkon">
                            Spørsmålet om søker har sagt opp jobben eller redusert arbeidstiden har
                            ikke blitt stilt i søknadsdialogen da søker opplyser at hun/han jobber
                            mer enn 50 %.
                        </Normaltekst>
                    ))}
            </GridTabell>
            {skalViseSøknadsdata && (
                <GridTabell underTabellMargin={0}>
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
                </GridTabell>
            )}
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
            <Normaltekst>
                Har sagt opp jobben eller redusert arbeidstiden de siste 6 måneder
            </Normaltekst>
            <Normaltekst>
                {sagtOppEllerRedusertStilling &&
                    SagtOppEllerRedusertTilTekst[sagtOppEllerRedusertStilling]}
            </Normaltekst>
            {harSagtOpp && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Årsak til oppsigelse</Normaltekst>
                    <Normaltekst>{årsak}</Normaltekst>
                    <Søknadsgrunnlag />
                    <Normaltekst>Dato for oppsigelse</Normaltekst>
                    <Normaltekst>{formaterNullableIsoDato(dato)}</Normaltekst>
                </>
            )}
            {harRedusertStilling && (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Årsak redusert arbeidstid</Normaltekst>
                    <Normaltekst>{årsak}</Normaltekst>
                    <Søknadsgrunnlag />
                    <Normaltekst>Dato for når arbeidstiden ble redusert</Normaltekst>
                    <Normaltekst>{formaterNullableIsoDato(dato)}</Normaltekst>
                </>
            )}
        </>
    );
};

export default SagtOppEllerRedusertInfo;
