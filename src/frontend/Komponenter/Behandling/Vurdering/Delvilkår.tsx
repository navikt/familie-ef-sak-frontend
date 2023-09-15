import * as React from 'react';
import { FC } from 'react';
import { Regel } from './typer';
import { DelvilkårContainer } from './DelvilkårContainer';
import { hjelpeTekstConfig } from './hjelpetekstconfig';
import { delvilkårTypeTilTekst, svarTypeTilTekst, tekstSkalKursiveres } from './tekster';
import { Vurdering } from '../Inngangsvilkår/vilkår';
import { Alert, HelpText, Radio, RadioGroup } from '@navikt/ds-react';
import styled from 'styled-components';

interface Props {
    regel: Regel;
    vurdering: Vurdering;
    settVurdering: (nyttSvar: Vurdering) => void;
}

const FontStyle = styled.div<{ italic: boolean }>`
    font-style: ${(props) => (props.italic ? 'italic' : 'normal')};
`;

const unntakFraHovedregelTekst = 'Er unntak fra hovedregelen oppfylt?';

const Delvilkår: FC<Props> = ({ regel, vurdering, settVurdering }) => {
    const hjelpetekst = hjelpeTekstConfig[regel.regelId];
    return (
        <DelvilkårContainer>
            <RadioGroup legend={delvilkårTypeTilTekst[regel.regelId]} value={vurdering.svar || ''}>
                {Object.keys(regel.svarMapping).map((svarId, i) => {
                    const erTekstKursiv = tekstSkalKursiveres(svarId);
                    return (
                        <>
                            {delvilkårTypeTilTekst[regel.regelId] === unntakFraHovedregelTekst &&
                                i === 0 && (
                                    <Alert size="small" variant="info">
                                        Det er nye regler for unntak fra 1. september 2023. Du må
                                        vurdere om det er nye eller gamle regler som gjelder for
                                        saken din.
                                    </Alert>
                                )}

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
                                <FontStyle italic={erTekstKursiv}>
                                    {svarTypeTilTekst[svarId]}
                                </FontStyle>
                            </Radio>
                        </>
                    );
                })}
            </RadioGroup>
            {hjelpetekst && (
                <HelpText placement={hjelpetekst.plassering}>
                    {React.createElement(hjelpetekst.komponent)}
                </HelpText>
            )}
        </DelvilkårContainer>
    );
};

export default Delvilkår;
