import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering, SvarPåVilkårsvurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import EndreVurderingComponent from './EndreVurderingComponent';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Redigeringsmodus } from './VisEllerEndreVurdering';
import { Cancel } from '@navikt/ds-icons';
import { Button, ErrorMessage, Heading } from '@navikt/ds-react';
import {
    EkspandertTilstand,
    useEkspanderbareVilkårpanelContext,
} from '../../../App/context/EkspanderbareVilkårpanelContext';

const Container = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

const FlexRow = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const FlexColumn = styled.div`
    display: flex;
    flex-direction: column;
`;
const VurderingTittel = styled.div`
    padding-right: 1rem;
`;

interface Props {
    data: IVurdering;
    lagreVurdering: (vurdering: SvarPåVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    settRedigeringsmodus: (verdi: Redigeringsmodus) => void;
    feilmelding: string | undefined;
    initiellRedigeringsmodus: Redigeringsmodus;
}

const EndreVurdering: FC<Props> = ({
    data,
    lagreVurdering,
    feilmelding,
    settRedigeringsmodus,
    initiellRedigeringsmodus,
}) => {
    const { regler, hentAnsvarligSaksbehandler, hentBehandling } = useBehandling();
    const { settPanelITilstand } = useEkspanderbareVilkårpanelContext();
    const vurdering = data;
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);

    const oppdaterVurdering = (vurdering: SvarPåVilkårsvurdering) => {
        if (!oppdatererVurdering) {
            settOppdatererVurdering(true);
            // eslint-disable-next-line
            lagreVurdering(vurdering).then((response: any) => {
                settOppdatererVurdering(false);
                if (response.status === RessursStatus.SUKSESS) {
                    settRedigeringsmodus(Redigeringsmodus.VISNING);
                    hentBehandling.rerun();
                } else {
                    hentAnsvarligSaksbehandler.rerun();
                }
            });
        }
    };

    const avbrytVurdering = () => {
        initiellRedigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET
            ? settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET)
            : settRedigeringsmodus(Redigeringsmodus.VISNING);

        settPanelITilstand(vurdering.vilkårType, EkspandertTilstand.EKSPANDERT);
    };

    return (
        <Container>
            {feilmelding && (
                <ErrorMessage size={'small'}>
                    Oppdatering av vilkår feilet: {feilmelding}
                </ErrorMessage>
            )}
            {regler.status === RessursStatus.SUKSESS && (
                <FlexColumn>
                    <FlexRow>
                        <VurderingTittel>
                            <Heading size={'small'} level={'3'}>
                                Vilkår vurderes
                            </Heading>
                        </VurderingTittel>
                        <Button
                            type={'button'}
                            variant={'tertiary'}
                            icon={<Cancel />}
                            onClick={avbrytVurdering}
                            size={'small'}
                        >
                            <span>Avbryt</span>
                        </Button>
                    </FlexRow>

                    <EndreVurderingComponent
                        oppdaterVurdering={oppdaterVurdering}
                        vilkårType={vurdering.vilkårType}
                        regler={regler.data.vilkårsregler[vurdering.vilkårType].regler}
                        vurdering={vurdering}
                    />
                </FlexColumn>
            )}
        </Container>
    );
};
export default EndreVurdering;
