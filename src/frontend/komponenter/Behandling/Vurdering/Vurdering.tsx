import * as React from 'react';
import { FC, useState } from 'react';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    VilkårResultat,
    vilkårsResultatTypeTilTekst,
} from '../Inngangsvilkår/vilkår';
import { Radio, RadioGruppe, Select, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { Element, Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import RedigerBlyant from '../../../ikoner/RedigerBlyant';
import Lenke from 'nav-frontend-lenker';
import { VurderingConfig } from './VurderingConfig';

const StyledEndreVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 10px;
    }
`;

const StyledVurdering = styled.div`
    > *:not(:first-child) {
        margin-top: 5px;
    }
`;

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

interface Props {
    data: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
}

/**
 * TODO Styling av StyledVurdering
 */
const Vurdering: FC<Props> = ({ data, oppdaterVurdering }) => {
    const [vurdering, settVurdering] = useState<IVurdering>(data);
    const [redigeringsmodus, settRedigeringsmodus] = useState<boolean>(
        vurdering.resultat !== VilkårResultat.IKKE_VURDERT
    );
    const [feilet, setFeilet] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, setOppdatererVurdering] = useState<boolean>(false);

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Savner config for {vurdering.vilkårType}</div>;
    }
    if (redigeringsmodus) {
        return (
            <StyledVurdering>
                <Undertittel>Manuelt behandlet</Undertittel>
                <Lenke href="#" onClick={() => settRedigeringsmodus(false)}>
                    <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                    <span>Rediger</span>
                </Lenke>
                <Normaltekst>{config.vilkår}</Normaltekst>
                {vurdering.unntak && (
                    <>
                        <Element>Unntak</Element>
                        <Normaltekst>{unntakTypeTilTekst[vurdering.unntak]}</Normaltekst>
                    </>
                )}
                <Element>Begrunnelse</Element>
                <Normaltekst>{vurdering.begrunnelse}</Normaltekst>
            </StyledVurdering>
        );
    }
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
                        setOppdatererVurdering(true);
                        oppdaterVurdering(vurdering)
                            .then(() => {
                                setOppdatererVurdering(false);
                                setFeilet(undefined);
                                settRedigeringsmodus(true);
                            })
                            .catch((e: Error) => {
                                setOppdatererVurdering(false);
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
export default Vurdering;
