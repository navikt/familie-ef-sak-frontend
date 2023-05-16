import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import Delårsperioder from './Delårsperioder';
import { Heading } from '@navikt/ds-react';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Visningsmodus } from './Skoleårsperiode';
import Utgiftsperioder from './Utgiftsperioder';
import { validerSkoleårsperioderUtenUtgiftsperioder } from './vedtaksvalidering';

const Container = styled(HorizontalScroll)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: ${AGray50};
`;

const TittelRad = styled.div`
    display: flex;
    justify-content: space-between;
`;

interface Props {
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
    settVisningsmodus: Dispatch<SetStateAction<Visningsmodus>>;
    tittel: string;
    skoleårsperiode: ISkoleårsperiodeSkolepenger;
    valideringsfeil: FormErrors<ISkoleårsperiodeSkolepenger> | undefined;
    visningsmodus: Visningsmodus;
}

const RedigerSkoleårsperiode: React.FC<Props> = ({
    fjernSkoleårsperiode,
    låsteUtgiftIder,
    oppdaterSkoleårsperiode,
    oppdaterValideringsfeil,
    settVisningsmodus,
    tittel,
    skoleårsperiode,
    valideringsfeil,
    visningsmodus,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const [delårsperioder, settDelårsperioder] = useState<IPeriodeSkolepenger[]>(
        skoleårsperiode.perioder
    );
    const [utgiftsperioder, settUtgiftsperioder] = useState<SkolepengerUtgift[]>(
        skoleårsperiode.utgiftsperioder
    );

    const knappTekst =
        visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODE ? 'Endre skoleår' : 'Lås skoleår';
    const knappIkon =
        visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODE ? (
            <PencilWritingIcon title={knappTekst} />
        ) : (
            <PadlockLockedIcon title={knappTekst} />
        );

    const oppdaterVisningsmodus = () => {
        const errors = validerSkoleårsperioderUtenUtgiftsperioder([
            { perioder: delårsperioder, utgiftsperioder: [] },
        ]);

        const good = errors.every((error) =>
            error.perioder.every((periode) =>
                Object.keys(periode).every((key) => periode[key] === undefined)
            )
        );

        if (good) {
            oppdaterSkoleårsperiode('perioder', delårsperioder);
            settVisningsmodus((prevState) =>
                prevState === Visningsmodus.REDIGER_UTGIFTSPERIODE
                    ? Visningsmodus.REDIGER_SKOLEÅRSPERIODE
                    : Visningsmodus.REDIGER_UTGIFTSPERIODE
            );
        } else {
            // TODO: Implementer visning av feilmeldinger
            console.log('Implementer visning av feilmeldinger');
        }
    };

    return (
        <Container
            synligVedLukketMeny={'1035px'}
            synligVedÅpenMeny={'1330px'}
            åpenHøyremeny={åpenHøyremeny}
        >
            <TittelRad>
                <Heading size="medium">{tittel}</Heading>
                <Knapp
                    icon={knappIkon}
                    iconPosition="right"
                    onClick={oppdaterVisningsmodus}
                    type="button"
                    variant="tertiary"
                >
                    <span>{knappTekst}</span>
                </Knapp>
            </TittelRad>
            <Delårsperioder
                behandlingErRedigerbar={behandlingErRedigerbar}
                data={delårsperioder}
                delårsperioder={delårsperioder}
                fjernSkoleårsperiode={fjernSkoleårsperiode}
                oppdater={(perioder) => oppdaterSkoleårsperiode('perioder', perioder)}
                settDelårsperioder={settDelårsperioder}
                settValideringsFeil={(oppdaterteFeil) =>
                    oppdaterValideringsfeil('perioder', oppdaterteFeil)
                }
                valideringsfeil={valideringsfeil && valideringsfeil.perioder}
                visningsmodus={visningsmodus}
            />
            <Utgiftsperioder
                data={utgiftsperioder}
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
        </Container>
    );
};

export default RedigerSkoleårsperiode;
