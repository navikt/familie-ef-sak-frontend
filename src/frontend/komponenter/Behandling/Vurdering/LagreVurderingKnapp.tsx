import { erGyldigVurdering } from './VurderingUtil';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import { Hovedknapp } from 'nav-frontend-knapper';
import * as React from 'react';
import { FC, useState } from 'react';
import { IVurdering } from '../Inngangsvilkår/vilkår';
import { Feilmelding } from 'nav-frontend-typografi';

interface Props {
    vurdering: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}

const LagreVurderingKnapp: FC<Props> = ({ vurdering, oppdaterVurdering, settRedigeringsmodus }) => {
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);
    return (
        <>
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
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
                                    setFeilmelding(`Ressurs har status ${ressurs.status}`);
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
        </>
    );
};

export default LagreVurderingKnapp;
