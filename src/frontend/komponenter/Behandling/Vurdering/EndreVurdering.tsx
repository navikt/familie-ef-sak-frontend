import * as React from 'react';
import { FC, useState } from 'react';
import { Radio, RadioGruppe, Select, Textarea } from 'nav-frontend-skjema';
import {
    delvilkårTypeTilTekst,
    IDelvilkår,
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
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
    let harPassertSisteDelvilkårSomSkalVises = false;
    const delvilkårsvurderinger = vurdering.delvilkårsvurderinger.map((delvilkår) => {
        const skalNullstillePåfølgendeDelvilkår =
            harPassertSisteDelvilkårSomSkalVises &&
            delvilkår.resultat !== Vilkårsresultat.IKKE_VURDERT;

        if (delvilkår.type === oppdatertDelvilkår.type) {
            harPassertSisteDelvilkårSomSkalVises = true;
            return oppdatertDelvilkår;
        } else if (skalNullstillePåfølgendeDelvilkår) {
            return { type: delvilkår.type, resultat: Vilkårsresultat.IKKE_VURDERT };
        } else {
            return delvilkår;
        }
    });
    return {
        ...vurdering,
        delvilkårsvurderinger: delvilkårsvurderinger,
        resultat:
            oppdatertDelvilkår.resultat === Vilkårsresultat.JA
                ? Vilkårsresultat.JA
                : vurdering.resultat,
        unntak: undefined,
    };
};

const hentResultatForUnntak = (unntakType: UnntakType | undefined): Vilkårsresultat => {
    if (!unntakType) {
        return Vilkårsresultat.IKKE_VURDERT;
    } else if (unntakType === UnntakType.HAR_IKKE_UNNTAK) {
        return Vilkårsresultat.NEI;
    } else {
        return Vilkårsresultat.JA;
    }
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

    const nesteDelvilkårSomManglerVurdering = vurdering.delvilkårsvurderinger.find(
        (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );
    let harPassertSisteDelvilkårSomSkalVises = false;
    const sisteDelvilkår: IDelvilkår =
        vurdering.delvilkårsvurderinger[vurdering.delvilkårsvurderinger.length - 1];
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
                    <RadioGruppe legend={delvilkårTypeTilTekst[delvilkår.type]}>
                        {[Vilkårsresultat.JA, Vilkårsresultat.NEI].map((vilkårsresultat) => (
                            <Radio
                                key={vilkårsresultat}
                                label={vilkårsresultatTypeTilTekst[vilkårsresultat]}
                                name={delvilkår.type}
                                onChange={() =>
                                    settVurdering(
                                        oppdaterDelvilkår(vurdering, {
                                            type: delvilkår.type,
                                            resultat: vilkårsresultat,
                                        })
                                    )
                                }
                                value={vilkårsresultat}
                                checked={delvilkår.resultat === vilkårsresultat}
                            />
                        ))}
                    </RadioGruppe>
                );
            })}
            {config.unntak && sisteDelvilkår.resultat === Vilkårsresultat.NEI && (
                <Select
                    label="Unntak"
                    value={vurdering.unntak || undefined}
                    onChange={(e) => {
                        const unntak = !e.target.value ? undefined : (e.target.value as UnntakType);
                        settVurdering({
                            ...vurdering,
                            unntak: unntak,
                            resultat: hentResultatForUnntak(unntak),
                        });
                    }}
                >
                    <option value="">Velg...</option>
                    <option value={UnntakType.HAR_IKKE_UNNTAK}>Har ikke unntak</option>
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
