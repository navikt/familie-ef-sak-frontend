import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering, SvarPåVilkårsvurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Feilmelding, Undertittel } from 'nav-frontend-typografi';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import EndreVurderingComponent from './EndreVurderingComponent';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Redigeringsmodus } from './VisEllerEndreVurdering';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';

const OuterEndreVurderingContainer = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

const AvbrytKnappContainer = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const InnerEndreVurderingContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
const StyledUndertittel = styled(Undertittel)`
    padding-right: 10rem;
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
    const { regler, hentBehandling } = useBehandling();
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
                }
            });
        }
    };

    const avbrytVurdering = () => {
        initiellRedigeringsmodus === Redigeringsmodus.IKKE_PÅSTARTET
            ? settRedigeringsmodus(Redigeringsmodus.IKKE_PÅSTARTET)
            : settRedigeringsmodus(Redigeringsmodus.VISNING);
    };

    return (
        <OuterEndreVurderingContainer>
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
            {regler.status === RessursStatus.SUKSESS && (
                <InnerEndreVurderingContainer>
                    <AvbrytKnappContainer>
                        <StyledUndertittel>Vilkår vurderes</StyledUndertittel>
                        <LenkeKnapp onClick={avbrytVurdering}>
                            <span>Avbryt</span>
                        </LenkeKnapp>
                    </AvbrytKnappContainer>
                    <EndreVurderingComponent
                        oppdaterVurdering={oppdaterVurdering}
                        vilkårType={vurdering.vilkårType}
                        regler={regler.data.vilkårsregler[vurdering.vilkårType].regler}
                        vurdering={vurdering}
                    />
                </InnerEndreVurderingContainer>
            )}
        </OuterEndreVurderingContainer>
    );
};
export default EndreVurdering;
