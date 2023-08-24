import * as React from 'react';
import { FC } from 'react';

import { ISagtOppEllerRedusertStilling } from '../../../../App/typer/aktivitetstyper';
import {
    ESagtOppEllerRedusert,
    SagtOppEllerRedusertTilTekst,
} from '../../Inngangsvilkår/Samliv/typer';
import DokumentasjonSendtInn from '../../Inngangsvilkår/DokumentasjonSendtInn';
import { IDokumentasjonGrunnlag } from '../../Inngangsvilkår/vilkår';
import { BodyLongSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import Informasjonsrad from '../../Vilkårpanel/Informasjonsrad';
import { VilkårInfoIkon } from '../../Vilkårpanel/VilkårInformasjonKomponenter';
import { InformasjonContainer } from '../../Vilkårpanel/StyledVilkårInnhold';
import { lagArbeidsforholdLink } from '../../../../Felles/Lenker/Lenker';
import { useApp } from '../../../../App/context/AppContext';
import { Link } from '@navikt/ds-react';

interface Props {
    sagtOppEllerRedusert: ISagtOppEllerRedusertStilling;
    dokumentasjon?: IDokumentasjonGrunnlag;
    harAvsluttetArbeidsforholdIRegister: boolean;
}

const SagtOppEllerRedusertInfo: FC<Props> = ({
    sagtOppEllerRedusert,
    dokumentasjon,
    harAvsluttetArbeidsforholdIRegister,
}) => {
    const { sagtOppEllerRedusertStilling, årsak, dato } = sagtOppEllerRedusert;
    return (
        <InformasjonContainer>
            {sagtOppEllerRedusert.sagtOppEllerRedusertStilling ? (
                <HarSagtOppEllerRedusertStilling
                    sagtOppEllerRedusertStilling={sagtOppEllerRedusertStilling}
                    årsak={årsak}
                    dato={dato}
                    harAvsluttetArbeidsforholdIRegister={harAvsluttetArbeidsforholdIRegister}
                />
            ) : (
                <BodyLongSmall className="tekstUtenIkon">
                    Spørsmålet om søker har sagt opp jobben eller redusert arbeidstiden har ikke
                    blitt stilt i søknadsdialogen da søker opplyser at hun/han jobber mer enn 50 %.
                </BodyLongSmall>
            )}

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
        </InformasjonContainer>
    );
};

const HarSagtOppEllerRedusertStilling: React.FC<ISagtOppEllerRedusertStilling> = ({
    sagtOppEllerRedusertStilling,
    årsak,
    dato,
    harAvsluttetArbeidsforholdIRegister,
}) => {
    const harSagtOpp = sagtOppEllerRedusertStilling === ESagtOppEllerRedusert.sagtOpp;
    const harRedusertStilling =
        sagtOppEllerRedusertStilling === ESagtOppEllerRedusert.redusertStilling;
    const { axiosRequest, appEnv, valgtFagsakId } = useApp();
    return (
        <>
            <Informasjonsrad
                ikon={VilkårInfoIkon.SØKNAD}
                label="Har sagt opp jobben eller redusert arbeidstiden de siste 6 måneder"
                verdi={
                    sagtOppEllerRedusertStilling &&
                    SagtOppEllerRedusertTilTekst[sagtOppEllerRedusertStilling]
                }
            />
            {harSagtOpp && (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Årsak til oppsigelse"
                        verdi={årsak}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Dato for oppsigelse"
                        verdi={dato}
                    />
                </>
            )}
            {harRedusertStilling && (
                <>
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Årsak redusert arbeidstid"
                        verdi={årsak}
                    />
                    <Informasjonsrad
                        ikon={VilkårInfoIkon.SØKNAD}
                        label="Dato for når arbeidstiden ble redusert"
                        verdi={dato}
                    />
                </>
            )}
            {harAvsluttetArbeidsforholdIRegister && (
                <Informasjonsrad
                    ikon={VilkårInfoIkon.REGISTER}
                    label={'Registrert avsluttet arbeidsforhold i aareg siste 6 mnd'}
                    verdi={
                        <Link
                            href="#"
                            onClick={async (e: React.SyntheticEvent) => {
                                e.preventDefault();
                                window.open(
                                    await lagArbeidsforholdLink(axiosRequest, appEnv, valgtFagsakId)
                                );
                            }}
                        >
                            Se arbeidsforhold i aareg
                        </Link>
                    }
                />
            )}
        </>
    );
};

export default SagtOppEllerRedusertInfo;
