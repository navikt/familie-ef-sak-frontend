import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { ABlue200, ABorderSubtle, AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import Delårsperioder from './Delårsperioder';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { validerSkoleårsperioderUtenBegrunnelseOgUtgiftsperioder } from './vedtaksvalidering';
import Utgiftsperioder from './Utgiftsperioder';
import Makssats from './Makssats';
import SkoleårsperiodeHeader from './SkoleårsperiodeHeader';
import { utledSkoleårOgMaksBeløp, utledSkoleårString } from '../skoleår';

const ContainerDashedBorder = styled.div`
    border: 4px dashed ${ABlue200};
    padding: 1rem;
    border-radius: 0.5rem;
`;

const Container = styled.div`
    padding: 1rem;
    border-radius: 0.25rem;
    background-color: ${AGray50};
`;

const HorisontalScroll = styled(HorizontalScroll)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const FlexEnd = styled.div`
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
`;

const FlexRow = styled.div`
    display: flex;
    gap: 1rem;
`;

const Grid = styled.div<{ skalSladdes: boolean; erKlikkbar: boolean }>`
    display: grid;
    grid-template-columns: 1fr 1fr;
    opacity: ${(props) => (props.skalSladdes ? '0.5' : '1')};
    pointer-events: ${(props) => (props.erKlikkbar ? 'auto' : 'none')};
`;

const HorizontalDivider = styled.div`
    border-bottom: 2px solid ${ABorderSubtle};
`;

const VerticalDivider = styled.span`
    border-left: 2px solid ${ABorderSubtle};
`;

export enum Visningsmodus {
    INITIELL = 'INITIELL',
    REDIGER_SKOLEÅRSPERIODER = 'REDIGER_SKOLEÅRSPERIODER',
    REDIGER_UTGIFTSPERIODER = 'REDIGER_UTGIFTSPERIODER',
    VISNING = 'VISNING',
}

type Props = {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    fjernSkoleårsperiode: () => void;
    låsteUtgiftIder: string[];
    oppdaterSkoleårsperiode: (
        property: keyof ISkoleårsperiodeSkolepenger,
        value: ISkoleårsperiodeSkolepenger[keyof ISkoleårsperiodeSkolepenger]
    ) => void;
    oppdaterValideringsfeil: (
        property: keyof ISkoleårsperiodeSkolepenger,
        oppdaterteFeil: FormErrors<SkolepengerUtgift | IPeriodeSkolepenger>[]
    ) => void;
    skoleårsperiode: ISkoleårsperiodeSkolepenger;
    valideringsfeil: FormErrors<ISkoleårsperiodeSkolepenger> | undefined;
};

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

    const utledVisningsmodus = () => {
        if (!behandlingErRedigerbar) {
            return Visningsmodus.VISNING;
        } else if (skoleårsperiode.erHentetFraBackend) {
            return Visningsmodus.REDIGER_UTGIFTSPERIODER;
        } else if (skoleårsperiode.perioder.length === 0) {
            return Visningsmodus.REDIGER_SKOLEÅRSPERIODER;
        } else if (skoleårsperiode.utgiftsperioder.length === 0) {
            return Visningsmodus.REDIGER_UTGIFTSPERIODER;
        }
        return Visningsmodus.INITIELL;
    };

    const [visningsmodus, settVisningsmodus] = useState<Visningsmodus>(utledVisningsmodus);

    const erInitiellModus = visningsmodus === Visningsmodus.INITIELL;
    const kanRedigereSkoleperiode = visningsmodus === Visningsmodus.REDIGER_SKOLEÅRSPERIODER;
    const kanRedigereUtgiftsperiode = visningsmodus === Visningsmodus.REDIGER_UTGIFTSPERIODER;
    const erLesevisning = visningsmodus === Visningsmodus.VISNING;

    const [skoleår, maksBeløp] = utledSkoleårOgMaksBeløp(skoleårsperiode);

    const skoleårString = utledSkoleårString(skoleår.toString(), (skoleår + 1).toString());

    const oppdaterVisningsmodus = () => {
        if (erInitiellModus || kanRedigereSkoleperiode) {
            validerSkoleårsperioderOgEndreVisningsmodus();
        } else if (kanRedigereUtgiftsperiode) {
            settVisningsmodus(Visningsmodus.REDIGER_SKOLEÅRSPERIODER);
        }
    };

    const validerSkoleårsperioderOgEndreVisningsmodus = () => {
        if (customValidate(validerSkoleårsperioderUtenBegrunnelseOgUtgiftsperioder)) {
            settVisningsmodus(Visningsmodus.REDIGER_UTGIFTSPERIODER);
        }
    };

    const inneholderLåsteUtgifter = skoleårsperiode.utgiftsperioder.some(
        (utgift) => låsteUtgiftIder.indexOf(utgift.id) > -1
    );

    const skalViseFjernKnapp = !erLesevisning && !inneholderLåsteUtgifter;
    const erLesevisningForDelårsperioder = erLesevisning || kanRedigereUtgiftsperiode;
    const utgiftsperioderErKlikkbar = kanRedigereUtgiftsperiode || erLesevisning;

    switch (visningsmodus) {
        case Visningsmodus.INITIELL:
            return (
                <ContainerDashedBorder>
                    <HorisontalScroll
                        synligVedLukketMeny={'1035px'}
                        synligVedÅpenMeny={'1330px'}
                        åpenHøyremeny={åpenHøyremeny}
                    >
                        <SkoleårsperiodeHeader
                            fjernSkoleårsperiode={fjernSkoleårsperiode}
                            skoleår={skoleårString}
                            oppdaterVisningsmodus={oppdaterVisningsmodus}
                            skalViseFjernKnapp={skalViseFjernKnapp}
                            visningsmodus={visningsmodus}
                        />
                        <Delårsperioder
                            delårsperioder={skoleårsperiode.perioder}
                            erLesevisning={erLesevisningForDelårsperioder}
                            oppdaterSkoleårsperiode={(perioder) =>
                                oppdaterSkoleårsperiode('perioder', perioder)
                            }
                            settValideringsfeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil('perioder', oppdaterteFeil)
                            }
                            valideringsfeil={valideringsfeil && valideringsfeil.perioder}
                        />
                        <FlexEnd>
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
                        </FlexEnd>
                    </HorisontalScroll>
                </ContainerDashedBorder>
            );
        case Visningsmodus.REDIGER_SKOLEÅRSPERIODER:
        case Visningsmodus.REDIGER_UTGIFTSPERIODER:
        case Visningsmodus.VISNING:
            return (
                <Container>
                    <HorisontalScroll
                        synligVedLukketMeny={'1035px'}
                        synligVedÅpenMeny={'1330px'}
                        åpenHøyremeny={åpenHøyremeny}
                    >
                        <SkoleårsperiodeHeader
                            fjernSkoleårsperiode={fjernSkoleårsperiode}
                            skoleår={skoleårString}
                            oppdaterVisningsmodus={oppdaterVisningsmodus}
                            skalViseFjernKnapp={skalViseFjernKnapp}
                            visningsmodus={visningsmodus}
                        />
                        <Delårsperioder
                            delårsperioder={skoleårsperiode.perioder}
                            erLesevisning={erLesevisningForDelårsperioder}
                            oppdaterSkoleårsperiode={(perioder) =>
                                oppdaterSkoleårsperiode('perioder', perioder)
                            }
                            settValideringsfeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil('perioder', oppdaterteFeil)
                            }
                            valideringsfeil={valideringsfeil && valideringsfeil.perioder}
                        />
                        <HorizontalDivider />
                        <Grid
                            skalSladdes={kanRedigereSkoleperiode}
                            erKlikkbar={utgiftsperioderErKlikkbar}
                        >
                            <Utgiftsperioder
                                erLesevisning={erLesevisning}
                                låsteUtgiftIder={låsteUtgiftIder}
                                oppdaterSkoleårsperiode={(utgiftsperioder) =>
                                    oppdaterSkoleårsperiode('utgiftsperioder', utgiftsperioder)
                                }
                                settValideringsfeil={(oppdaterteFeil) =>
                                    oppdaterValideringsfeil('utgiftsperioder', oppdaterteFeil)
                                }
                                skoleår={skoleårString}
                                utgiftsperioder={skoleårsperiode.utgiftsperioder}
                                valideringsfeil={valideringsfeil && valideringsfeil.utgiftsperioder}
                            />
                            <FlexRow>
                                <VerticalDivider />
                                <Makssats makssats={maksBeløp} />
                            </FlexRow>
                        </Grid>
                    </HorisontalScroll>
                </Container>
            );
    }
};

export default Skoleårsperiode;
