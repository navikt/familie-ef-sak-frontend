import * as React from 'react';
import { FC, useState } from 'react';
import { Radio, RadioGruppe, Select, Textarea } from 'nav-frontend-skjema';
import {
    delvilkårTypeTilTekst,
    IDelvilkår,
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    VilkårResultat,
    vilkårsResultatTypeTilTekst,
} from '../Inngangsvilkår/vilkår';
import { Feilmelding } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { IVilkårConfig } from './VurderingConfig';
import styled from 'styled-components';
import { erGyldigVurdering } from './VurderingUtil';
import { Ressurs, RessursStatus } from '@navikt/familie-typer';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

const oppdaterDelvilkår = (vurdering: IVurdering, oppdatertDelvilkår: IDelvilkår): IVurdering => {
    return {
        ...vurdering,
        delvilkårVurderinger: vurdering.delvilkårVurderinger.map((delvilkår) =>
            delvilkår.type === oppdatertDelvilkår.type ? oppdatertDelvilkår : delvilkår
        ),
    };
};

interface Props {
    config: IVilkårConfig;
    data: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}
const EndreVurdering: FC<Props> = ({ config, data, oppdaterVurdering, settRedigeringsmodus }) => {
    const [feilmelding, setFeilmelding] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    const delvilkårSomManglerVurdering: IDelvilkår[] = vurdering.delvilkårVurderinger.filter(
        (delvilkår) => delvilkår.resultat === VilkårResultat.IKKE_VURDERT
    );
    const nesteDelvilkår =
        delvilkårSomManglerVurdering.length > 0 ? delvilkårSomManglerVurdering[0] : null;
    let erPåDelvilkårSomSkalVurderes = false;
    return (
        <StyledEndreVurdering>
            {nesteDelvilkår &&
                vurdering.delvilkårVurderinger.map((delvilkår) => {
                    if (erPåDelvilkårSomSkalVurderes) {
                        return null;
                    }
                    if (nesteDelvilkår.type === delvilkår.type) {
                        erPåDelvilkårSomSkalVurderes = true;
                    }
                    return (
                        <RadioGruppe legend={delvilkårTypeTilTekst[delvilkår.type]}>
                            {[VilkårResultat.JA, VilkårResultat.NEI].map((vilkårResultat) => (
                                <Radio
                                    key={vilkårResultat}
                                    label={vilkårsResultatTypeTilTekst[vilkårResultat]}
                                    name={delvilkår.type}
                                    onChange={() =>
                                        settVurdering(
                                            oppdaterDelvilkår(vurdering, {
                                                type: delvilkår.type,
                                                resultat: vilkårResultat,
                                            })
                                        )
                                    }
                                    value={vilkårResultat}
                                    checked={delvilkår.resultat === vilkårResultat}
                                />
                            ))}
                        </RadioGruppe>
                    );
                })}
            {/*            <RadioGruppe legend={config.vilkår}>
                {[VilkårResultat.JA, VilkårResultat.NEI].map((vilkårResultat) => (
                    <Radio
                        key={vilkårResultat}
                        label={vilkårsResultatTypeTilTekst[vilkårResultat]}
                        name={vurdering.vilkårType}
                        onChange={() => {
                            const oppdaterUnntak = () =>
                                vilkårResultat === VilkårResultat.NEI
                                    ? undefined
                                    : vurdering.unntak;
                            settVurdering({
                                ...vurdering,
                                resultat: vilkårResultat,
                                unntak: oppdaterUnntak(),
                            });
                        }}
                        value={vilkårResultat}
                        checked={vurdering.resultat === vilkårResultat}
                    />
                ))}
            </RadioGruppe>*/}
            {config.unntak && vurdering.resultat !== VilkårResultat.NEI && (
                <Select
                    label="Unntak"
                    value={vurdering.unntak || undefined}
                    onChange={(e) => {
                        settVurdering({
                            ...vurdering,
                            unntak: e.target.value as UnntakType,
                        });
                    }}
                >
                    <option value={undefined}>Velg...</option>
                    {config.unntak.map((unntak) => (
                        <option key={unntak} value={unntak}>
                            {unntakTypeTilTekst[unntak]}
                        </option>
                    ))}
                </Select>
            )}
            <Textarea
                label="Begrunnelse"
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
        </StyledEndreVurdering>
    );
};
export default EndreVurdering;
