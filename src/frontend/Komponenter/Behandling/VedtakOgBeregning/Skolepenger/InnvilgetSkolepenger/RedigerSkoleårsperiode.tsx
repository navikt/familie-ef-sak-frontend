import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import Delårsperioder from './Delårsperioder';
import { Heading } from '@navikt/ds-react';
import { månedÅrTilDate, sorterDatoDesc, tilForkortetÅr } from '../../../../../App/utils/dato';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { PadlockLockedIcon, PencilWritingIcon } from '@navikt/aksel-icons';
import { Visningsmodus } from './Skoleårsperiode';
import Utgiftsperioder from './Utgiftsperioder';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import {
    validerKunSkoleårsperioder,
    validerSkoleårsperioderUtenUtgiftsperioder,
} from './vedtaksvalidering';

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
    settVisningsmodus: Dispatch<SetStateAction<Visningsmodus>>;
    skoleårsperiode: ISkoleårsperiodeSkolepenger;
    valideringsfeil: FormErrors<ISkoleårsperiodeSkolepenger> | undefined;
    visningsmodus: Visningsmodus;
}

const utledStartårForSkoleår = (dato: Date) => {
    const erFørAugust = dato.getMonth() < 7;
    const startÅr = parseInt(tilForkortetÅr(dato), 10);

    return erFørAugust ? startÅr - 1 : startÅr;
};

const utledSkoleårTittel = (delårsperioder: IPeriodeSkolepenger[]) => {
    console.log('utleding av tittel');
    const sortertePerioderDesc = [...delårsperioder]
        .map((periode) => månedÅrTilDate(periode.årMånedFra))
        .sort(sorterDatoDesc);

    const startÅr = utledStartårForSkoleår(sortertePerioderDesc[0]);
    const sluttÅr = startÅr + 1;

    return `Skoleår ${startÅr}/${sluttÅr}`;
};

const RedigerSkoleårsperiode: React.FC<Props> = ({
    customValidate,
    fjernSkoleårsperiode,
    låsteUtgiftIder,
    oppdaterSkoleårsperiode,
    oppdaterValideringsfeil,
    settVisningsmodus,
    skoleårsperiode,
    valideringsfeil,
    visningsmodus,
}) => {
    console.log('redigerSkoleårsperiode rendrer');
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const [delårsperioder, settDelårsperioder] = useState<IPeriodeSkolepenger[]>(
        skoleårsperiode.perioder
    );
    const tittel = utledSkoleårTittel(skoleårsperiode.perioder);
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
                data={skoleårsperiode.perioder}
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
        </Container>
    );
};

export default RedigerSkoleårsperiode;
