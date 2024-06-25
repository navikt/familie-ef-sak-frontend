import { Regel } from './typer';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { erUnntakForeldet, svarTypeTilTekst } from './tekster';
import { Alert, Label, Radio } from '@navikt/ds-react';
import * as React from 'react';
import styled from 'styled-components';
import { splittListe } from '../../../App/utils/utils';

const Italic = styled.div`
    font-style: italic;
`;

const Spacing = styled.div`
    margin-top: 1rem;
`;

interface Props {
    regel: Regel;
    settVurdering: (nyttSvar: Vurdering) => void;
}

export const RadioKnapperMedlemskapUnntak: React.FC<Props> = ({ regel, settVurdering }) => {
    const unntak = Object.keys(regel.svarMapping);
    const [foreldedeUnntak, nåværendeUnntak] = splittListe(unntak, erUnntakForeldet);

    return (
        <>
            <InfoStripe />
            <Spacing />
            {nåværendeUnntak.map((svarId) => (
                <Radio
                    key={`${regel.regelId}_${svarId}`}
                    name={`${regel.regelId}_${svarId}`}
                    value={svarId}
                    onChange={() =>
                        settVurdering({
                            svar: svarId,
                            regelId: regel.regelId,
                        })
                    }
                >
                    {svarTypeTilTekst[svarId]}
                </Radio>
            ))}
            <Spacing />
            <Label size="small" spacing>
                Gamle regler for unntak:
            </Label>
            {foreldedeUnntak.map((svarId) => (
                <Radio
                    key={`${regel.regelId}_${svarId}`}
                    name={`${regel.regelId}_${svarId}`}
                    value={svarId}
                    onChange={() =>
                        settVurdering({
                            svar: svarId,
                            regelId: regel.regelId,
                        })
                    }
                >
                    <Italic>{svarTypeTilTekst[svarId]}</Italic>
                </Radio>
            ))}
            <Spacing />
        </>
    );
};

const InfoStripe: React.FC = () => (
    <Alert size="small" variant="info">
        Det er nye regler for unntak fra 1. september 2023. Du må vurdere om det er nye eller gamle
        regler som gjelder for saken din.
    </Alert>
);
