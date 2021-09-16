import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from 'nav-frontend-skjema';
import Panel from 'nav-frontend-paneler';
import { Textarea } from 'nav-frontend-skjema';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../App/context/AppContext';
import PdfVisning from '../../../Felles/Pdf/PdfVisning';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';

const StyledManueltBrev = styled.div`
    width: 50%;
    margin-bottom: 10rem;
`;

const Innholdsrad = styled(Panel)`
    margin-top: 1rem;
`;

const Knapper = styled.div`
    margin-top: 2rem;

    display: flex;
    justify-content: space-between;
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
    const [avsnitt, settAvsnitt] = useState(førsteRad);
    const [brev, settBrev] = useState<Ressurs<string>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    const genererBrev = () => {
        const avsnittUtenId = avsnitt.map((rad) => {
            return { deloverskrift: rad.deloverskrift, innhold: rad.innhold };
        });

        axiosRequest<any, { overskrift: string; avsnitt: any }>({
            method: 'POST',
            url: `/familie-brev/api/json2pdf`,
            data: { overskrift, avsnitt: avsnittUtenId },
        }).then((respons: Ressurs<string>) => {
            console.log('respons', respons);
            settBrev(respons);
        });
    };

    const leggTilRad = () => {
        settAvsnitt((s: any) => {
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

        settAvsnitt((s) => {
            const newArr = s.slice();
            newArr[index].deloverskrift = e.target.value;

            return newArr;
        });
    };

    const endreInnhold = (e: any) => {
        e.preventDefault();

        const index = e.target.id;

        settAvsnitt((s) => {
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

            {avsnitt.map((rad, i) => {
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

            <Knapper>
                <Knapp onClick={leggTilRad}>Legg til rad</Knapp>
                <Hovedknapp onClick={genererBrev}>Generer brev</Hovedknapp>
            </Knapper>

            {brev && <PdfVisning pdfFilInnhold={brev} />}
        </StyledManueltBrev>
    );
};

export default ManueltBrev;
