import * as React from 'react';
import { FC, useState } from 'react';
import { Textarea } from 'nav-frontend-skjema';
import { IDelvilkår, IVurdering, UnntakType, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { Feilmelding } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { IVilkårConfig } from './VurderingConfig';
import styled from 'styled-components';
import { erGyldigVurdering } from './VurderingUtil';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';
import Unntak from './Unntak';
import Delvilkår from './Delvilkår';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    config: IVilkårConfig;
    data: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}
const EndreVurdering: FC<Props> = ({ config, data, oppdaterVurdering, settRedigeringsmodus }) => {
    const [feilmelding, settFeilmelding] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);
    const [vurdering, settVurdering] = useState<IVurdering>(data);

    const nesteDelvilkårSomManglerVurdering = vurdering.delvilkårsvurderinger.find(
        (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );
    let harPassertSisteDelvilkårSomSkalVises = false;
    const harPassertSisteDelvilkårOgUnntakSomSkalVises = false;
    const sisteDelvilkår: IDelvilkår =
        vurdering.delvilkårsvurderinger[vurdering.delvilkårsvurderinger.length - 1];

    console.log(config.unntak, sisteDelvilkår.resultat);
    return (
        <StyledEndreVurdering>
            {vurdering.delvilkårsvurderinger.map((delvilkår) => {
                if (harPassertSisteDelvilkårSomSkalVises) {
                    return null;
                }
                if (
                    nesteDelvilkårSomManglerVurdering?.type === delvilkår.type ||
                    delvilkår.resultat === Vilkårsresultat.JA
                ) {
                    harPassertSisteDelvilkårSomSkalVises = true;
                }
                return (
                    <Delvilkår
                        key={delvilkår.type}
                        delvilkår={delvilkår}
                        vurdering={vurdering}
                        settVurdering={settVurdering}
                    />
                );
            })}
            {config.unntak && sisteDelvilkår.resultat && (
                <Unntak
                    key={vurdering.id}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    unntak={config.unntak}
                />
            )}
            {vurdering.unntak === UnntakType.IKKE_OPPFYLT && (
                <Textarea
                    label="Begrunnelse (hvis aktuelt)"
                    maxLength={0}
                    placeholder="Skriv inn tekst"
                    value={vurdering.begrunnelse || ''}
                    onChange={(e) => {
                        settVurdering({
                            ...vurdering,
                            begrunnelse: e.target.value,
                        });
                    }}
                />
            )}
            {feilmelding && <Feilmelding>Oppdatering av vilkår feilet: {feilmelding}</Feilmelding>}
            {harPassertSisteDelvilkårOgUnntakSomSkalVises && (
                <Hovedknapp
                    onClick={() => {
                        if (erGyldigVurdering(vurdering)) {
                            settOppdatererVurdering(true);
                            oppdaterVurdering(vurdering).then((ressurs) => {
                                if (ressurs.status === RessursStatus.SUKSESS) {
                                    settOppdatererVurdering(false);
                                    settFeilmelding(undefined);
                                    settRedigeringsmodus(false);
                                } else {
                                    settOppdatererVurdering(false);
                                    if (
                                        ressurs.status === RessursStatus.FEILET ||
                                        ressurs.status === RessursStatus.IKKE_TILGANG
                                    ) {
                                        settFeilmelding(ressurs.frontendFeilmelding);
                                    } else {
                                        settFeilmelding(`Ressurs har status ${ressurs.status}`);
                                    }
                                }
                            });
                        } else {
                            settFeilmelding('Du må fylle i alle verdier');
                        }
                    }}
                    disabled={oppdatererVurdering}
                >
                    Lagre
                </Hovedknapp>
            )}
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
