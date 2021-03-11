import * as React from 'react';
import { FC } from 'react';
import { StyledTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { VilkårStatus, VilkårStatusIkon } from '../../../Felleskomponenter/Visning/VilkårOppfylt';
import { ISagtOppEllerRedusertStilling } from '../../../../typer/overgangsstønad';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import {
    ESagtOppEllerRedusert,
    SagtOppEllerRedusertTilTekst,
} from '../../Inngangsvilkår/Samliv/typer';
import { formaterNullableIsoDato } from '../../../../utils/formatter';

interface Props {
    sagtOppEllerRedusert: ISagtOppEllerRedusertStilling;
    vilkårStatus: VilkårStatus;
}

const SagtOppEllerRedusertVisning: FC<Props> = ({ sagtOppEllerRedusert, vilkårStatus }) => {
    const { sagtOppEllerRedusertStilling, årsak, dato } = sagtOppEllerRedusert;
    return (
        <>
            <StyledTabell>
                <VilkårStatusIkon className={'vilkårStatusIkon'} vilkårStatus={vilkårStatus} />
                <div className="tittel">
                    <Undertittel>Sagt opp arbeidsforhold</Undertittel>
                </div>
                {sagtOppEllerRedusert.sagtOppEllerRedusertStilling ? (
                    <>
                        <HarSagtOppEllerRedusertStilling
                            sagtOppEllerRedusertStilling={sagtOppEllerRedusertStilling}
                            årsak={årsak}
                            dato={dato}
                        />
                    </>
                ) : (
                    <Normaltekst className="tekstUtenIkon">
                        Spørsmålet om søker har sagt opp jobben eller redusert arbeidstiden har ikke
                        blitt stilt i søknadsdialogen da søker opplyser at hun/han jobber mer enn
                        50%.
                    </Normaltekst>
                )}
            </StyledTabell>
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
                Har sagt opp jobben eller redusert arbeidstiden de siste 6 måneder?
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

export default SagtOppEllerRedusertVisning;
