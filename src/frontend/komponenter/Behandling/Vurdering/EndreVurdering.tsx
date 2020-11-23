import * as React from 'react';
import { FC, useState } from 'react';
import { IVilkårData, IVurdering } from '../Inngangsvilkår/vilkår';
import { Feilmelding } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { erGyldigVurdering } from './VurderingUtil';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { IVilkårConfig } from './VurderingConfig';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    config: IVilkårConfig;
    data: IVurdering;
    vilkårData: IVilkårData;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

const EndreVurdering: FC<Props> = ({
    config,
    data,
    vilkårData,
    oppdaterVurdering,
    settRedigeringsmodus,
}) => {
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    return (
        <StyledEndreVurdering>
            {config.vurdering({
                config,
                vurdering,
                settVurdering,
                vilkårData,
                lagreKnapp: (visLagreKnapp) =>
                    (visLagreKnapp && (
                        <Hovedknapp
                            onClick={() => {
                                if (erGyldigVurdering(vurdering)) {
                                    settOppdatererVurdering(true);
                                    oppdaterVurdering(vurdering).then((ressurs) => {
                                        if (ressurs.status === RessursStatus.SUKSESS) {
                                            settOppdatererVurdering(false);
                                            setFeilmelding(undefined);
                                            settRedigeringsmodus(false);
                                        } else {
                                            settOppdatererVurdering(false);
                                            if (
                                                ressurs.status === RessursStatus.FEILET ||
                                                ressurs.status === RessursStatus.IKKE_TILGANG
                                            ) {
                                                setFeilmelding(ressurs.frontendFeilmelding);
                                            } else {
                                                setFeilmelding(
                                                    `Ressurs har status ${ressurs.status}`
                                                );
                                            }
                                        }
                                    });
                                } else {
                                    setFeilmelding('Du må fylle i alle verdier');
                                }
                            }}
                            disabled={oppdatererVurdering}
                        >
                            Lagre
                        </Hovedknapp>
                    )) ||
                    undefined,
            })}
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
