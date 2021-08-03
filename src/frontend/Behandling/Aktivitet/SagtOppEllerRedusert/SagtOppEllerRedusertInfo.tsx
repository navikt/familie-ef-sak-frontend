import * as React from 'react';
import { FC } from 'react';
import { GridTabell } from '../../../Felleskomponenter/Visning/StyledTabell';
import { Normaltekst } from 'nav-frontend-typografi';

import { ISagtOppEllerRedusertStilling } from '../../../typer/overgangsstønad';
import { Søknadsgrunnlag } from '../../../Felleskomponenter/Visning/DataGrunnlagIkoner';
import {
    ESagtOppEllerRedusert,
    SagtOppEllerRedusertTilTekst,
} from '../../Inngangsvilkår/Samliv/typer';
import { formaterNullableIsoDato } from '../../../utils/formatter';

interface Props {
    sagtOppEllerRedusert: ISagtOppEllerRedusertStilling;
}

const SagtOppEllerRedusertInfo: FC<Props> = ({ sagtOppEllerRedusert }) => {
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
                    <Normaltekst className="tekstUtenIkon">
                        Spørsmålet om søker har sagt opp jobben eller redusert arbeidstiden har ikke
                        blitt stilt i søknadsdialogen da søker opplyser at hun/han jobber mer enn 50
                        %.
                    </Normaltekst>
                )}
            </GridTabell>
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
