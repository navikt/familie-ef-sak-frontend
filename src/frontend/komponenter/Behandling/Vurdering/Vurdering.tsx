import * as React from 'react';
import { FC, useState } from 'react';
import {
    IVurdering,
    UnntakType,
    unntakTypeTilTekst,
    VilkårResultat,
    vilkårsResultatTypeTilTekst,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import { Radio, RadioGruppe, Select, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import { Element, Feilmelding, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import RedigerBlyant from '../../../ikoner/RedigerBlyant';
import Lenke from 'nav-frontend-lenker';

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

interface IVilkårConfig {
    vilkår: string;
    unntak?: UnntakType[];
}
type IVurderingConfig = {
    [key in VilkårType]: IVilkårConfig;
};
const VurderingConfig: IVurderingConfig = {
    FORUTGÅENDE_MEDLEMSKAP: {
        vilkår: 'Vilkår for vurdering om utenlandsopphold er oppfylt',
        unntak: [
            UnntakType.ARBEID_NORSK_ARBEIDSGIVER,
            UnntakType.UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER,
        ],
    },
};

interface Props {
    vurdering: IVurdering;
    className?: string;
    oppdaterVurdering: (vurdering: IVurdering) => Promise<void>;
}

/**
 * Hva skal skje hvis Resultat == Nei? Då trenger man vel ikke fortsette med denne behandlingen?
 * Styling av StyledVurdering
 * Valideringer når man klikker på endre-knappen
 */
const Vurdering: FC<Props> = ({ vurdering, className, oppdaterVurdering }) => {
    const config = VurderingConfig[vurdering.vilkårType];
    const [vurderingState, setVurderingState] = useState<IVurdering>(vurdering);
    const [lagret, setLagret] = useState<boolean>(
        vurdering.resultat !== VilkårResultat.IKKE_VURDERT
    );
    const [feilet, setFeilet] = useState<string | undefined>(undefined);
    if (lagret) {
        return (
            <StyledVurdering className={className}>
                <Undertittel>Manuelt behandlet</Undertittel>
                <Lenke href="#" onClick={() => setLagret(false)}>
                    <RedigerBlyant width={19} heigth={19} withDefaultStroke={false} />
                    <span>Rediger</span>
                </Lenke>
                <Normaltekst>{config.vilkår}</Normaltekst>
                <Element>Unntak</Element>
                {vurderingState.unntak && (
                    <>
                        <Normaltekst>{vurderingState.unntak}</Normaltekst>
                        <Element>Begrunnelse</Element>
                    </>
                )}
                <Normaltekst>{vurderingState.begrunnelse}</Normaltekst>
            </StyledVurdering>
        );
    }
    return (
        <StyledEndreVurdering className={className}>
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
                            unntak: e.target.value,
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
            {feilet && <Feilmelding>{feilet}</Feilmelding>}
            <Hovedknapp
                onClick={() => {
                    oppdaterVurdering(vurderingState)
                        .then(() => {
                            setFeilet(undefined);
                            setLagret(true);
                        })
                        .catch((e: Error) => {
                            setFeilet(e.message);
                        });
                }}
            >
                Lagre
            </Hovedknapp>
        </StyledEndreVurdering>
    );
};
export default Vurdering;
