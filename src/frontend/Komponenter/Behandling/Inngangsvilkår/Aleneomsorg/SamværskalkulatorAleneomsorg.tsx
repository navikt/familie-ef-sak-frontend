import React, { ChangeEvent, useState } from 'react';
import { BodyShort, Button, Dropdown, HStack, Label, Select } from '@navikt/ds-react';
import { CalculatorIcon, ChevronDownIcon } from '@navikt/aksel-icons';
import styled from 'styled-components';
import {
    Samværskalkulator,
    kalkulerSamværsandeler,
} from '../../../../Felles/Kalkulator/Samværskalkulator';
import {
    AGray300,
    AGray50,
    ASurfaceDefault,
    ASurfaceInfoSubtle,
} from '@navikt/ds-tokens/dist/tokens';
import { Samværsandel, Samværsavtale, Samværsuke } from '../../../../App/typer/samværsavtale';
import { IBarnMedSamvær } from './typer';
import { utledNavnOgAlderForAleneomsorg } from './utils';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { useApp } from '../../../../App/context/AppContext';
import {
    oppdaterSamværsuke,
    oppdaterSamværsuker,
    oppdaterVarighetPåSamværsavtale,
    utledInitiellSamværsavtale,
} from '../../../../Felles/Kalkulator/utils';

const Kalkulator = styled(Samværskalkulator)`
    padding: 1rem;
    background-color: ${ASurfaceDefault};
    border: 1rem solid ${AGray50};
`;

const StyledHStack = styled(HStack)<{ $borderBottom: boolean }>`
    border-bottom: ${(props) => (props.$borderBottom ? `1px solid ${AGray300}` : 'none')};
`;

const Divider = styled.div`
    margin: 1rem;
    border-bottom: 1px solid ${AGray300};
`;

const OppsummeringContainer = styled(HStack)`
    padding-left: 1rem;
    background: ${ASurfaceInfoSubtle};
    border: 1rem solid ${AGray50};
`;

const DropdownMenu = styled(Dropdown.Menu)`
    padding-top: 1rem;
    width: max-content;
`;

const BehandlingBarnSelect = styled(Select)`
    width: max-content;
`;

enum Visningsmodus {
    REDIGERINGSMODUS_INGEN_LAGRET_AVTALE,
    REDIGERINGSMODUS_EKSPANDERT,
    REDIGERINGSMODUS_MINIMERT,
    LESEVISNING_INGEN_LAGRET_AVTALE,
    LESEVISNING_EKSPANDERT,
    LESEVISNING_MINIMERT,
}

const utledInitiellVisningsmodus = (
    behandlingErRedigerbar: boolean,
    samværsavtale: Samværsavtale | undefined
) => {
    if (behandlingErRedigerbar) {
        return samværsavtale === undefined
            ? Visningsmodus.REDIGERINGSMODUS_INGEN_LAGRET_AVTALE
            : Visningsmodus.REDIGERINGSMODUS_MINIMERT;
    }
    return samværsavtale === undefined
        ? Visningsmodus.LESEVISNING_INGEN_LAGRET_AVTALE
        : Visningsmodus.LESEVISNING_MINIMERT;
};

interface Props {
    gjeldendeBehandlingBarnId: string;
    behandlingId: string;
    lagredeSamværsavtaler: Samværsavtale[];
    lagreSamværsavtale: (avtale: Samværsavtale) => void;
    slettSamværsavtale: (behandlingId: string, behandlingBarnId: string) => void;
    alleBehandlingBarn: IBarnMedSamvær[];
    skalViseBorderBottom: boolean;
}

export const SamværskalkulatorAleneomsorg: React.FC<Props> = ({
    gjeldendeBehandlingBarnId,
    behandlingId,
    lagredeSamværsavtaler,
    lagreSamværsavtale,
    slettSamværsavtale,
    alleBehandlingBarn,
    skalViseBorderBottom,
}) => {
    const lagretSamværsavtale = lagredeSamværsavtaler.find(
        (avtale) => avtale.behandlingBarnId === gjeldendeBehandlingBarnId
    );

    const { nullstillIkkePersistertKomponent, settIkkePersistertKomponent } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const [samværsavtale, settSamværsavtale] = useState<Samværsavtale>(
        utledInitiellSamværsavtale(lagretSamværsavtale, behandlingId, gjeldendeBehandlingBarnId)
    );
    const [visningsmodus, settVisningsmodus] = useState<Visningsmodus>(
        utledInitiellVisningsmodus(behandlingErRedigerbar, lagretSamværsavtale)
    );
    const [erDropdownEkspandert, settErDropdownEkspandert] = useState<boolean>(false);
    const [samværsavtaleMal, settSamværsavtaleMal] = useState<Samværsavtale>();

    const [samværsandelerDagVisning, samværsandelProsentVisning] = kalkulerSamværsandeler(
        samværsavtale.uker
    );

    const alleAndreLagredeSamværsavtaler = lagredeSamværsavtaler.filter(
        (avtale) => avtale.behandlingBarnId !== gjeldendeBehandlingBarnId
    );

    const kanKopiereSamværsavtale = alleAndreLagredeSamværsavtaler.length > 0;

    const håndterOppdaterSamværsuke = (
        ukeIndex: number,
        ukedag: string,
        samværsandeler: Samværsandel[]
    ) => {
        settIkkePersistertKomponent(gjeldendeBehandlingBarnId);
        oppdaterSamværsuke(ukeIndex, ukedag, samværsandeler, settSamværsavtale);
    };

    const håndterOppdaterSamværsuker = (samværsuker: Samværsuke[]) => {
        settIkkePersistertKomponent(gjeldendeBehandlingBarnId);
        oppdaterSamværsuker(samværsuker, settSamværsavtale);
    };

    const håndterOppdaterVarighetPåSamværsavtale = (nyVarighet: number) => {
        settIkkePersistertKomponent(gjeldendeBehandlingBarnId);
        oppdaterVarighetPåSamværsavtale(samværsavtale.uker.length, nyVarighet, settSamværsavtale);
    };

    const håndterÅpneDropdown = () => {
        if (kanKopiereSamværsavtale) {
            settErDropdownEkspandert((prevState) => !prevState);
        } else {
            settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_EKSPANDERT);
        }
    };

    const håndterLukkKalkulator = () => {
        settVisningsmodus(utledInitiellVisningsmodus(behandlingErRedigerbar, lagretSamværsavtale));
        settSamværsavtale(
            utledInitiellSamværsavtale(lagretSamværsavtale, behandlingId, gjeldendeBehandlingBarnId)
        );
        nullstillIkkePersistertKomponent(gjeldendeBehandlingBarnId);
    };

    const håndterLagreSamværsavtale = () => {
        lagreSamværsavtale(samværsavtale);
        settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_MINIMERT);
        nullstillIkkePersistertKomponent(gjeldendeBehandlingBarnId);
    };

    const håndterSlettSamværsavtale = () => {
        slettSamværsavtale(behandlingId, gjeldendeBehandlingBarnId);
        settVisningsmodus(Visningsmodus.REDIGERINGSMODUS_INGEN_LAGRET_AVTALE);
        settSamværsavtale(
            utledInitiellSamværsavtale(undefined, behandlingId, gjeldendeBehandlingBarnId)
        );
        nullstillIkkePersistertKomponent(gjeldendeBehandlingBarnId);
    };

    switch (visningsmodus) {
        case Visningsmodus.REDIGERINGSMODUS_INGEN_LAGRET_AVTALE:
            return (
                <StyledHStack
                    $borderBottom={skalViseBorderBottom}
                    justify="end"
                    margin="4"
                    padding="4"
                >
                    <Dropdown open={erDropdownEkspandert} onOpenChange={håndterÅpneDropdown}>
                        <Button type="button" as={Dropdown.Toggle} size="small">
                            <CalculatorIcon aria-hidden fontSize="1.5rem" />
                        </Button>
                        <DropdownMenu>
                            <HStack gap="8" justify="space-between" align="end">
                                <SamværsavtaleSelect
                                    samværsavtaler={alleAndreLagredeSamværsavtaler}
                                    behandlingBarn={alleBehandlingBarn}
                                    settSamværsavtaleMal={settSamværsavtaleMal}
                                />
                                <div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="small"
                                        onClick={() => {
                                            settErDropdownEkspandert((prevState) => !prevState);
                                            settVisningsmodus(
                                                Visningsmodus.REDIGERINGSMODUS_EKSPANDERT
                                            );
                                            settIkkePersistertKomponent(gjeldendeBehandlingBarnId);
                                            if (samværsavtaleMal !== undefined) {
                                                håndterOppdaterSamværsuker(samværsavtaleMal.uker);
                                                settSamværsavtaleMal(undefined);
                                            }
                                        }}
                                    >
                                        Åpne kalkulator
                                    </Button>
                                </div>
                            </HStack>
                        </DropdownMenu>
                    </Dropdown>
                </StyledHStack>
            );
        case Visningsmodus.REDIGERINGSMODUS_MINIMERT:
        case Visningsmodus.LESEVISNING_MINIMERT:
            return (
                <>
                    <OppsummeringContainer justify="space-between" align="center">
                        <HStack align="center" gap="4">
                            <HStack gap="2" align="center">
                                <CalculatorIcon aria-hidden />
                                <Label>Samvær:</Label>
                            </HStack>
                            <BodyShort size="medium">{`${samværsandelerDagVisning} = ${samværsandelProsentVisning}`}</BodyShort>
                        </HStack>
                        <HStack gap="4">
                            <Button
                                size="medium"
                                variant="tertiary"
                                icon={<ChevronDownIcon />}
                                onClick={() =>
                                    settVisningsmodus(
                                        behandlingErRedigerbar
                                            ? Visningsmodus.REDIGERINGSMODUS_EKSPANDERT
                                            : Visningsmodus.LESEVISNING_EKSPANDERT
                                    )
                                }
                            />
                        </HStack>
                    </OppsummeringContainer>
                    {skalViseBorderBottom && <Divider />}
                </>
            );
        case Visningsmodus.REDIGERINGSMODUS_EKSPANDERT:
        case Visningsmodus.LESEVISNING_EKSPANDERT:
            return (
                <>
                    <Kalkulator
                        samværsuker={samværsavtale.uker}
                        onSave={() => håndterLagreSamværsavtale()}
                        onDelete={() => håndterSlettSamværsavtale()}
                        onClose={() => håndterLukkKalkulator()}
                        oppdaterSamværsuke={håndterOppdaterSamværsuke}
                        oppdaterVarighet={håndterOppdaterVarighetPåSamværsavtale}
                        erLesevisning={!behandlingErRedigerbar}
                    />
                    {skalViseBorderBottom && <Divider />}
                </>
            );
        case Visningsmodus.LESEVISNING_INGEN_LAGRET_AVTALE:
            return <></>;
    }
};

const SamværsavtaleSelect: React.FC<{
    samværsavtaler: Samværsavtale[];
    behandlingBarn: IBarnMedSamvær[];
    settSamværsavtaleMal: React.Dispatch<React.SetStateAction<Samværsavtale | undefined>>;
}> = ({ samværsavtaler, behandlingBarn, settSamværsavtaleMal }) => (
    <BehandlingBarnSelect
        label="Velg mal"
        size="small"
        onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            settSamværsavtaleMal(
                samværsavtaler.find((avtale) => avtale.behandlingBarnId === event.target.value)
            )
        }
    >
        <option value="0">Ny kalkulator</option>
        {samværsavtaler.map((avtale) => {
            const gjeldendeBarn = behandlingBarn.find(
                (barn) => barn.barnId === avtale.behandlingBarnId
            );
            const visningsnavn = utledNavnOgAlderForAleneomsorg(
                gjeldendeBarn?.registergrunnlag,
                gjeldendeBarn?.søknadsgrunnlag
            );
            const visningstekst = `Kopier fra ${visningsnavn}`;

            return (
                <option key={avtale.behandlingBarnId} value={avtale.behandlingBarnId}>
                    {visningstekst}
                </option>
            );
        })}
    </BehandlingBarnSelect>
);
