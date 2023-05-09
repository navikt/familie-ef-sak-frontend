import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import UtgiftsperiodeSkolepenger from './UtgiftsperiodeSkolepenger';
import { ABlue200 } from '@navikt/ds-tokens/dist/tokens';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import Delårsperioder from './Delårsperioder';
import { BodyLongSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { Alert } from '@navikt/ds-react';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { validerKunSkoleårsperioder, validerSkoleårsperioder } from './vedtaksvalidering';

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

enum Visningsmodus {
    INITIELL = 'INITIELL',
    SEMI_VISNING = 'SEMI_VISNING',
    VISNING = 'VISNING',
}

const utledVisningmodus = (behandlingErRedigerbar: boolean) => {
    if (!behandlingErRedigerbar) {
        return Visningsmodus.VISNING;
    }
    return Visningsmodus.INITIELL;
};

interface Props {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    fjernSkoleårsperiode: () => void;
    låsteUtgiftIder: string[];
    oppdaterSkoleårsperiode: (
        property: keyof ISkoleårsperiodeSkolepenger,
        value: ISkoleårsperiodeSkolepenger[keyof ISkoleårsperiodeSkolepenger]
    ) => void;
    oppdaterValideringsfeil: (
        property: keyof ISkoleårsperiodeSkolepenger,
        oppdaterteFeil: FormErrors<SkolepengerUtgift>[] | FormErrors<IPeriodeSkolepenger>[]
    ) => void;
    skoleårsperiode: ISkoleårsperiodeSkolepenger;
    valideringsfeil: FormErrors<ISkoleårsperiodeSkolepenger> | undefined;
}

const Skoleårsperiode: React.FC<Props> = ({
    customValidate,
    fjernSkoleårsperiode,
    låsteUtgiftIder,
    oppdaterSkoleårsperiode,
    oppdaterValideringsfeil,
    skoleårsperiode,
    valideringsfeil,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();

    const [visningsmodus, settVisninsmodus] = useState<Visningsmodus>(
        utledVisningmodus(behandlingErRedigerbar)
    );

    const variabel = false;

    const oppdaterVisningsmodus = () => {
        if (customValidate(validerKunSkoleårsperioder)) {
            settVisninsmodus(Visningsmodus.SEMI_VISNING);
        }
    };

    switch (visningsmodus) {
        case Visningsmodus.INITIELL:
            return (
                <DashedBorder>
                    <Container
                        synligVedLukketMeny={'1035px'}
                        synligVedÅpenMeny={'1330px'}
                        åpenHøyremeny={åpenHøyremeny}
                    >
                        <Delårsperioder
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            data={skoleårsperiode.perioder}
                            fjernSkoleårsperiode={fjernSkoleårsperiode}
                            oppdater={(perioder) => oppdaterSkoleårsperiode('perioder', perioder)}
                            settValideringsFeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil('perioder', oppdaterteFeil)
                            }
                            valideringsfeil={valideringsfeil && valideringsfeil.perioder}
                        />
                        <InfoStripe variant="info">
                            <FlexColumn>
                                <BodyLongSmall>
                                    Et normalt skoleår defineres som fra august/september år A til
                                    Juni/Juli år B. F.eks. september 2023 til og med juni 2024. Hvis
                                    bruker studerer på tvers av 2 skoleår f.eks. fra januar 2023 til
                                    og med desember 2023 må dette fordeles over 2 skoleår.
                                </BodyLongSmall>
                                <BodyLongSmall>
                                    Hvis bruker innad i et skoleår har perioder med ulik
                                    studiebelastning kan det legges til en ekstra rad for dette.
                                </BodyLongSmall>
                            </FlexColumn>
                        </InfoStripe>
                        <FlexRow>
                            <Knapp onClick={fjernSkoleårsperiode} type="button" variant="tertiary">
                                Avbryt
                            </Knapp>
                            <Knapp
                                onClick={oppdaterVisningsmodus}
                                type="button"
                                variant="secondary"
                            >
                                Legg til skoleår
                            </Knapp>
                        </FlexRow>
                        {variabel && (
                            <UtgiftsperiodeSkolepenger
                                data={skoleårsperiode.utgiftsperioder}
                                oppdater={(utgiftsperioder) =>
                                    oppdaterSkoleårsperiode('utgiftsperioder', utgiftsperioder)
                                }
                                behandlingErRedigerbar={behandlingErRedigerbar}
                                valideringsfeil={valideringsfeil && valideringsfeil.utgiftsperioder}
                                settValideringsFeil={(oppdaterteFeil) =>
                                    oppdaterValideringsfeil('utgiftsperioder', oppdaterteFeil)
                                }
                                låsteUtgiftIder={låsteUtgiftIder}
                            />
                        )}
                    </Container>
                </DashedBorder>
            );
        case Visningsmodus.SEMI_VISNING:
            return <p>meow</p>;
        case Visningsmodus.VISNING:
            return <p>meow meow</p>;
    }
};

export default Skoleårsperiode;
