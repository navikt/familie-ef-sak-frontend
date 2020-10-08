import * as React from 'react';
import { Radio, RadioGruppe, Select, Textarea } from 'nav-frontend-skjema';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    VilkårResultat,
    vilkårsResultatTypeTilTekst,
} from '../Inngangsvilkår/vilkår';
import { Feilmelding } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FC, useState } from 'react';
import { IVilkårConfig } from './VurderingConfig';
import styled from 'styled-components';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

interface Props {
    config: IVilkårConfig;
    data: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
    settRedigeringsmodus: (erRedigeringsmodus: boolean) => void;
}
const EndreVurdering: FC<Props> = ({ config, data, oppdaterVurdering, settRedigeringsmodus }) => {
    const [feilet, setFeilet] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, settOppdatererVurdering] = useState<boolean>(false);
    const [vurdering, settVurdering] = useState<IVurdering>(data);

    const erGyldigVurdering = (vurdering: IVurdering): boolean => {
        if (
            vurdering.resultat === VilkårResultat.IKKE_VURDERT ||
            !vurdering.begrunnelse ||
            vurdering.begrunnelse.trim().length === 0
        ) {
            return false;
        } else if (vurdering.resultat === VilkårResultat.JA) {
            return !!vurdering.unntak;
        } else return vurdering.resultat === VilkårResultat.NEI;
    };

    return (
        <StyledEndreVurdering>
            <RadioGruppe legend={config.vilkår}>
                {[VilkårResultat.JA, VilkårResultat.NEI].map((vilkårResultat) => (
                    <Radio
                        key={vilkårResultat}
                        label={vilkårsResultatTypeTilTekst[vilkårResultat]}
                        name={vurdering.vilkårType}
                        onChange={() => {
                            const skalResetteUnntak = () =>
                                vilkårResultat === VilkårResultat.NEI
                                    ? undefined
                                    : vurdering.unntak;
                            settVurdering({
                                ...vurdering,
                                resultat: vilkårResultat,
                                unntak: skalResetteUnntak(),
                            });
                        }}
                        value={vilkårResultat}
                        checked={vurdering.resultat === vilkårResultat}
                    />
                ))}
            </RadioGruppe>
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
            {feilet && <Feilmelding>Oppdatering av vilkår feilet: {feilet}</Feilmelding>}
            <Hovedknapp
                onClick={() => {
                    if (erGyldigVurdering(vurdering)) {
                        settOppdatererVurdering(true);
                        oppdaterVurdering(vurdering)
                            .then(() => {
                                settOppdatererVurdering(false);
                                setFeilet(undefined);
                                settRedigeringsmodus(true);
                            })
                            .catch((e: Error) => {
                                settOppdatererVurdering(false);
                                setFeilet(e.message);
                            });
                    } else {
                        setFeilet('Du må fylle i alle verdier');
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
