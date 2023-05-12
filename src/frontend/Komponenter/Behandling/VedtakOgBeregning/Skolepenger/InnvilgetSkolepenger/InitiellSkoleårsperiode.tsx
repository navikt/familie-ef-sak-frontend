import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { ABlue200 } from '@navikt/ds-tokens/dist/tokens';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import Delårsperioder from './Delårsperioder';
import { BodyLongSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { Alert, Heading } from '@navikt/ds-react';
import { Visningsmodus } from './Skoleårsperiode';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import {
    validerKunSkoleårsperioder,
    validerSkoleårsperioderUtenUtgiftsperioder,
} from './vedtaksvalidering';

const DashedBorder = styled.div`
    border: 4px dashed ${ABlue200};
    padding: 1rem;
    border-radius: 0.5rem;
`;

const Container = styled(HorizontalScroll)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const InfoStripe = styled(Alert)`
    .navds-alert__wrapper {
        max-width: max-content;
    }
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
`;

interface Props {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    fjernSkoleårsperiode: () => void;
    oppdaterSkoleårsperiode: (
        property: keyof ISkoleårsperiodeSkolepenger,
        value: ISkoleårsperiodeSkolepenger[keyof ISkoleårsperiodeSkolepenger]
    ) => void;
    oppdaterValideringsfeil: (
        property: keyof ISkoleårsperiodeSkolepenger,
        oppdaterteFeil: FormErrors<SkolepengerUtgift>[] | FormErrors<IPeriodeSkolepenger>[]
    ) => void;

    settVisningsmodus: Dispatch<SetStateAction<Visningsmodus>>;
    skoleårsperiode: ISkoleårsperiodeSkolepenger;
    valideringsfeil: FormErrors<ISkoleårsperiodeSkolepenger> | undefined;
    visningsmodus: Visningsmodus;
}

const InitiellSkoleårsperiode: React.FC<Props> = ({
    customValidate,
    fjernSkoleårsperiode,
    oppdaterSkoleårsperiode,
    oppdaterValideringsfeil,
    settVisningsmodus,
    skoleårsperiode,
    valideringsfeil,
    visningsmodus,
}) => {
    console.log('initiellSkolersperiode rendrer');
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const [delårsperioder, settDelårsperioder] = useState<IPeriodeSkolepenger[]>(
        skoleårsperiode.perioder
    );
    console.log('delårsperioder', delårsperioder);
    const oppdaterVisningsmodus = () => {
        console.log('kjører oppdaterer visningsmodus metoden');

        const errors = validerSkoleårsperioderUtenUtgiftsperioder([
            { perioder: delårsperioder, utgiftsperioder: [] },
        ]);

        console.log('utledede errors', errors);

        const good = errors.every((error) =>
            error.perioder.every((periode) =>
                Object.keys(periode).every((key) => periode[key] === undefined)
            )
        );

        console.log('ingen errors', good);

        errors.forEach((error) =>
            error.perioder.forEach((periode) =>
                Object.keys(periode).forEach((key) => console.log('iererer', key, periode[key]))
            )
        );

        if (good) {
            oppdaterSkoleårsperiode('perioder', delårsperioder);
            settVisningsmodus(Visningsmodus.REDIGER_UTGIFTSPERIODE);
        } else {
            console.log('validering feilet');
        }
    };

    return (
        <DashedBorder>
            <Container
                synligVedLukketMeny={'1035px'}
                synligVedÅpenMeny={'1330px'}
                åpenHøyremeny={åpenHøyremeny}
            >
                <Heading size="medium">Legg til skoleår</Heading>
                <Delårsperioder
                    behandlingErRedigerbar={behandlingErRedigerbar}
                    delårsperioder={delårsperioder}
                    data={skoleårsperiode.perioder}
                    fjernSkoleårsperiode={fjernSkoleårsperiode}
                    oppdater={(perioder) => oppdaterSkoleårsperiode('perioder', perioder)}
                    settDelårsperioder={settDelårsperioder}
                    settValideringsFeil={(oppdaterteFeil) =>
                        oppdaterValideringsfeil('perioder', oppdaterteFeil)
                    }
                    valideringsfeil={valideringsfeil && valideringsfeil.perioder}
                    visningsmodus={visningsmodus}
                />
                <InfoStripe variant="info">
                    <FlexColumn>
                        <BodyLongSmall>
                            Et normalt skoleår defineres som fra august/september år A til Juni/Juli
                            år B. F.eks. september 2023 til og med juni 2024. Hvis bruker studerer
                            på tvers av 2 skoleår f.eks. fra januar 2023 til og med desember 2023 må
                            dette fordeles over 2 skoleår.
                        </BodyLongSmall>
                        <BodyLongSmall>
                            Hvis bruker innad i et skoleår har perioder med ulik studiebelastning
                            kan det legges til en ekstra rad for dette.
                        </BodyLongSmall>
                    </FlexColumn>
                </InfoStripe>
                <FlexRow>
                    <Knapp onClick={fjernSkoleårsperiode} type="button" variant="tertiary">
                        Avbryt
                    </Knapp>
                    <Knapp onClick={oppdaterVisningsmodus} type="button" variant="secondary">
                        Legg til skoleår
                    </Knapp>
                </FlexRow>
            </Container>
        </DashedBorder>
    );
};

export default InitiellSkoleårsperiode;
