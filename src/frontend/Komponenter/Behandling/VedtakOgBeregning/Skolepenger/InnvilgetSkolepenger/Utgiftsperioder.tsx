import styled from 'styled-components';
import React from 'react';
import { SkolepengerUtgift } from '../../../../../App/typer/vedtak';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import { tomUtgift } from '../typer';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { SmallTextLabel } from '../../../../../Felles/Visningskomponenter/Tekster';
import { ABlue300 } from '@navikt/ds-tokens/dist/tokens';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { Heading } from '@navikt/ds-react';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-bottom: 1rem;
`;

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, max-content);
    grid-gap: 0.25rem 1rem;
    align-items: baseline;

    .ny-rad {
        grid-column: 1;
    }
`;

const VertialDivider = styled.span`
    border-left: 4px solid ${ABlue300};
    margin-left: 0.25rem;
`;

const InputRightAligned = styled(InputMedTusenSkille)`
    text-align: right;
`;

type Props = {
    erLesevisning: boolean;
    låsteUtgiftIder: string[];
    oppdaterSkoleårsperiode: (data: SkolepengerUtgift[]) => void;
    settValideringsfeil: (errors: FormErrors<SkolepengerUtgift>[]) => void;
    skoleår: string;
    utgiftsperioder: SkolepengerUtgift[];
    valideringsfeil: FormErrors<SkolepengerUtgift>[] | undefined;
};

const Utgiftsperioder: React.FC<Props> = ({
    erLesevisning,
    låsteUtgiftIder,
    oppdaterSkoleårsperiode,
    settValideringsfeil,
    skoleår,
    utgiftsperioder,
    valideringsfeil,
}) => {
    const oppdaterUtgift = (
        index: number,
        property: keyof SkolepengerUtgift,
        value: string | number | undefined
    ) => {
        oppdaterSkoleårsperiode(
            utgiftsperioder.map((periode, i) =>
                index === i ? { ...periode, [property]: value } : periode
            )
        );
    };

    const fjernUtgift = (id: string) => {
        oppdaterSkoleårsperiode(utgiftsperioder.filter((utgift) => utgift.id !== id));
        settValideringsfeil((valideringsfeil || []).filter((formErrors) => formErrors.id !== id));
    };

    return (
        <Container>
            <Heading size={'small'} level={'3'}>
                {`Utgifter i skoleåret ${skoleår}`}
            </Heading>
            <FlexRow>
                <VertialDivider />
                <FlexColumn>
                    <Grid>
                        <SmallTextLabel>Stønadsbeløp</SmallTextLabel>
                        <SmallTextLabel>Utbetalingsmåned</SmallTextLabel>
                        {utgiftsperioder.map((utgift, index) => {
                            const erLåstFraForrigeBehandling =
                                låsteUtgiftIder.indexOf(utgift.id) > -1;
                            const skalViseFjernKnapp =
                                !erLesevisning && index !== 0 && !erLåstFraForrigeBehandling;
                            return (
                                <React.Fragment key={index}>
                                    <InputRightAligned
                                        className="ny-rad"
                                        label={'Stønadsbeløp'}
                                        hideLabel
                                        onKeyPress={tilHeltall}
                                        type="number"
                                        value={harTallverdi(utgift.stønad) ? utgift.stønad : ''}
                                        error={valideringsfeil && valideringsfeil[index]?.stønad}
                                        onChange={(e) => {
                                            oppdaterUtgift(
                                                index,
                                                'stønad',
                                                tilTallverdi(e.target.value)
                                            );
                                        }}
                                        erLesevisning={erLesevisning}
                                        disabled={erLåstFraForrigeBehandling}
                                    />
                                    <MånedÅrVelger
                                        årMånedInitiell={utgift.årMånedFra}
                                        antallÅrTilbake={0}
                                        antallÅrFrem={0}
                                        lesevisning={true}
                                        onEndret={() => null}
                                    />
                                    {skalViseFjernKnapp && (
                                        <FjernKnapp
                                            onClick={() => fjernUtgift(utgift.id)}
                                            ikontekst={'Fjern utgiftsperiode'}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Grid>
                    {!erLesevisning && (
                        <LeggTilKnapp
                            ikonPosisjon={'right'}
                            knappetekst={'Legg til ny utgift i skoleåret 23/24'}
                            onClick={() =>
                                oppdaterSkoleårsperiode([...utgiftsperioder, tomUtgift()])
                            }
                            variant={'tertiary'}
                        />
                    )}
                </FlexColumn>
            </FlexRow>
        </Container>
    );
};

export default Utgiftsperioder;
