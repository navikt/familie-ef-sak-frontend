import React, { FC } from 'react';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import {
    IBarnMedSamvær,
    typeBarnepassordningTilTekst,
} from '../../Inngangsvilkår/Aleneomsorg/typer';
import { GridTabell } from '../../../../Felles/Visningskomponenter/GridTabell';
import { Registergrunnlag, Søknadsgrunnlag } from '../../../../Felles/Ikoner/DataGrunnlagIkoner';
import EtikettDød from '../../../../Felles/Etiketter/EtikettDød';
import { nullableDatoTilAlder } from '../../../../App/utils/dato';
import { formaterNullableIsoDato } from '../../../../App/utils/formatter';
import styled from 'styled-components';

const TekstMedVenstrePadding = styled(Normaltekst)`
    padding-left: 0.5rem;
    font-style: italic;
`;

const TilsynsutgifterBarnInfo: FC<{
    gjeldendeBarn: IBarnMedSamvær;
    skalViseSøknadsdata?: boolean;
}> = ({ gjeldendeBarn }) => {
    const { registergrunnlag, barnepass } = gjeldendeBarn;
    const alder = nullableDatoTilAlder(registergrunnlag.fødselsdato);
    const harPassordning = barnepass && barnepass.barnepassordninger;
    const passordningTittel =
        harPassordning && barnepass?.barnepassordninger.length > 1
            ? 'Barnepassordninger'
            : 'Barnepassordning';

    return (
        <GridTabell kolonner={1}>
            {registergrunnlag.navn ? (
                <>
                    <Registergrunnlag />
                    <Element>
                        {registergrunnlag.navn} ({alder} år)
                        {registergrunnlag.dødsdato && (
                            <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                        )}
                    </Element>
                </>
            ) : null}
            <TekstMedVenstrePadding>Ingen søknadsopplysninger</TekstMedVenstrePadding>
        </GridTabell>
    );

    return (
        <GridTabell kolonner={3}>
            {registergrunnlag.navn ? (
                <>
                    <Registergrunnlag />
                    <Element>
                        {registergrunnlag.navn} ({alder} år)
                        {registergrunnlag.dødsdato && (
                            <EtikettDød dødsdato={registergrunnlag.dødsdato} />
                        )}
                    </Element>
                </>
            ) : null}
            {harPassordning ? (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>{passordningTittel}</Normaltekst>
                    <Normaltekst>
                        {barnepass?.barnepassordninger.map((ordning) => {
                            return typeBarnepassordningTilTekst[ordning.type]; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    </Normaltekst>
                </>
            ) : null}
            {harPassordning ? (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Navn passordning</Normaltekst>
                    <Normaltekst>
                        {barnepass?.barnepassordninger.map((ordning) => {
                            return ordning.navn; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    </Normaltekst>
                </>
            ) : null}
            {harPassordning ? (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Periode passordning</Normaltekst>
                    <Normaltekst>
                        {barnepass?.barnepassordninger.map((ordning) => {
                            return `${formaterNullableIsoDato(
                                ordning.fra
                            )} - ${formaterNullableIsoDato(ordning.til)}`; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    </Normaltekst>
                </>
            ) : null}
            {harPassordning ? (
                <>
                    <Søknadsgrunnlag />
                    <Normaltekst>Utgifter</Normaltekst>
                    <Normaltekst>
                        {barnepass?.barnepassordninger.map((ordning) => {
                            return ordning.beløp + ',-'; //TODO: Ta hensyn til at barn kan ha flere passordninger
                        })}
                    </Normaltekst>
                </>
            ) : null}
        </GridTabell>
    );
};

export default TilsynsutgifterBarnInfo;
