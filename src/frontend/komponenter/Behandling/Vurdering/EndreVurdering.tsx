import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Feilmelding } from 'nav-frontend-typografi';
import { VurderingConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    data: IVurdering;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

const EndreVurdering: FC<Props> = ({
    data,
    lagreVurdering,
    settRedigeringsmodus,
    inngangsvilkår,
}) => {
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);

    const oppdaterVurdering: () => void = () => {
        settOppdatererVurdering(true);
        lagreVurdering(vurdering)
            .then((ressurs) => {
                if (ressurs.status === RessursStatus.SUKSESS) {
                    setFeilmelding(undefined);
                    settRedigeringsmodus(false);
                } else {
                    if (
                        ressurs.status === RessursStatus.FEILET ||
                        ressurs.status === RessursStatus.IKKE_TILGANG
                    ) {
                        setFeilmelding(ressurs.frontendFeilmelding);
                    } else {
                        setFeilmelding(`Ressurs har status ${ressurs.status}`);
                    }
                }
            })
            .finally(() => settOppdatererVurdering(false));
    };

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Mangler config for {vurdering.vilkårType}</div>;
    }

    return (
        <StyledEndreVurdering>
            {config.renderVurdering({
                config,
                vurdering,
                settVurdering,
                oppdaterVurdering,
                inngangsvilkår,
                lagreknappDisabled: oppdatererVurdering,
            })}
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
