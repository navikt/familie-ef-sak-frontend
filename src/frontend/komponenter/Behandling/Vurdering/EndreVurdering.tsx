import * as React from 'react';
import { FC, useState } from 'react';
import { IInngangsvilkår, IVurdering } from '../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { Feilmelding } from 'nav-frontend-typografi';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    config: IVilkårConfig;
    data: IVurdering;
    inngangsvilkår: IInngangsvilkår;
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

const EndreVurdering: FC<Props> = ({
    config,
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
