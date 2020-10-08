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

interface Props {
    vurdering: IVurdering;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
}

/**
 * Hva skal skje hvis Resultat == Nei? Då trenger man vel ikke fortsette med denne behandlingen?
 * Styling av StyledVurdering
 * Valideringer når man klikker på endre-knappen
 * Burde feilhåndteringen håndteres på ett sted, eks att man har 1 komponent høgst opp på siden som viser feilmeldinger?
 */
const Vurdering: FC<Props> = ({ vurdering, oppdaterVurdering }) => {
    const [vurderingState, setVurderingState] = useState<IVurdering>(vurdering);
    const [lagret, setLagret] = useState<boolean>(
        vurdering.resultat !== VilkårResultat.IKKE_VURDERT
    );
    const [feilet, setFeilet] = useState<string | undefined>(undefined);
    const [oppdatererVurdering, setOppdatererVurdering] = useState<boolean>(false);

    const config = VurderingConfig[vurdering.vilkårType];
    if (!config) {
        return <div>Savner config for {vurdering.vilkårType}</div>;
    }
    if (lagret) {
        return (
            <StyledVurdering>
                <Undertittel>Manuelt behandlet</Undertittel>
                <Lenke href="#" onClick={() => setLagret(false)}>
                    <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                    <span>Rediger</span>
                </Lenke>
                <Normaltekst>{config.vilkår}</Normaltekst>
                {vurderingState.unntak && (
                    <>
                        <Element>Unntak</Element>
                        <Normaltekst>{unntakTypeTilTekst[vurderingState.unntak]}</Normaltekst>
                    </>
                )}
                <Element>Begrunnelse</Element>
                <Normaltekst>{vurderingState.begrunnelse}</Normaltekst>
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
                        name={vurderingState.vilkårType}
                        onChange={() => {
                            setVurderingState({
                                ...vurderingState,
                                resultat: vilkårResultat,
                            });
                        }}
                        value={vilkårResultat}
                        checked={vurderingState.resultat === vilkårResultat}
                    />
                ))}
            </RadioGruppe>
            {config.unntak && (
                <Select
                    label="Unntak"
                    value={vurderingState.unntak || undefined}
                    onChange={(e) => {
                        setVurderingState({
                            ...vurderingState,
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
                value={vurderingState.begrunnelse || ''}
                onChange={(e) => {
                    setVurderingState({
                        ...vurderingState,
                        begrunnelse: e.target.value,
                    });
                }}
            />
            {feilet && <Feilmelding>Oppdatering av vilkår feilet: {feilet}</Feilmelding>}
            <Hovedknapp
                onClick={() => {
                    setOppdatererVurdering(true);
                    oppdaterVurdering(vurderingState)
                        .then(() => {
                            setOppdatererVurdering(false);
                            setFeilet(undefined);
                            setLagret(true);
                        })
                        .catch((e: Error) => {
                            setOppdatererVurdering(false);
                            setFeilet(e.message);
                        });
                }}
                disabled={oppdatererVurdering}
            >
                Lagre
            </Hovedknapp>
        </StyledEndreVurdering>
    );
};
export default Vurdering;
