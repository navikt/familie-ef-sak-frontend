import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import { Textarea } from 'nav-frontend-skjema';
import { Knapp } from 'nav-frontend-knapper';

const StyledManueltBrev = styled.div`
    width: 50%;
    margin-bottom: 10rem;
`;

const Innholdsrad = styled(Panel)`
    margin-top: 1rem;
`;

const StyledKnapp = styled(Knapp)`
    margin-top: 2rem;
`;

const ManueltBrev = () => {
    const førsteRad = [
        {
            id: 1,
            deloverskrift: '',
            innhold: '',
        },
    ];

    const [overskrift, settOverskrift] = useState('');
    const [rader, settRader] = useState(førsteRad);

    const leggTilRad = () => {
        settRader((s: any) => {
            return [
                ...s,
                {
                    deloverskrift: '',
                    innhold: '',
                },
            ];
        });
    };

    const endreDeloverskrift = (e: any) => {
        e.preventDefault();

        const index = e.target.id;

        settRader((s) => {
            const newArr = s.slice();
            newArr[index].deloverskrift = e.target.value;

            return newArr;
        });
    };

    const endreInnhold = (e: any) => {
        e.preventDefault();

        const index = e.target.id;

        settRader((s) => {
            const newArr = s.slice();
            newArr[index].innhold = e.target.value;

            return newArr;
        });
    };

    return (
        <StyledManueltBrev>
            <h1>Manuelt brev</h1>
            <Input
                label="Overskrift"
                value={overskrift}
                onChange={(e) => {
                    settOverskrift(e.target.value);
                }}
            />

            {rader.map((rad, i) => {
                return (
                    <Innholdsrad border>
                        <Input
                            onChange={endreDeloverskrift}
                            label="Deloverskrift (valgfri)"
                            id={i.toString()}
                            value={rad.deloverskrift}
                        />
                        <Textarea
                            onChange={endreInnhold}
                            defaultValue=""
                            label="Innhold"
                            id={i.toString()}
                            value={rad.innhold}
                        />
                    </Innholdsrad>
                );
            })}

            <StyledKnapp onClick={leggTilRad}>Legg til rad</StyledKnapp>
        </StyledManueltBrev>
    );
};

export default ManueltBrev;
