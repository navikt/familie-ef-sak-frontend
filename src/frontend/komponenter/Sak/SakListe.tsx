import * as React from 'react';
import { useSakListeRessurser } from '../../context/SakListeContext';
import { RessursStatus } from '../../typer/ressurs';
import styled from 'styled-components';
import { useHistory } from 'react-router';

const Td = styled.td`
    border: 1px solid black;
`;

const Th = styled.th`
    border: 1px solid black;
`;

const SakListe: React.FunctionComponent = () => {
    const history = useHistory();
    const { ressurser, hentSakListe } = useSakListeRessurser();
    React.useEffect(() => {
        // I SakContainer brukes ressurser.sak.status !== RessursStatus.SUKSESS men då får jeg en evig loop
        if (ressurser.saker.status === RessursStatus.IKKE_HENTET) {
            hentSakListe();
        }
    }, []);
    switch (ressurser.saker.status) {
        case RessursStatus.SUKSESS:
            if (ressurser.saker.data.saker.length) {
                return (
                    <table>
                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>PersonIdent</Th>
                                <Th>Navn</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {ressurser.saker.data.saker.map(sak => (
                                <tr
                                    key={sak.sakId}
                                    role={'button'}
                                    onClick={() => {
                                        history.push(`/sak/${sak.sakId}/`);
                                    }}
                                >
                                    <Td>{sak.sakId}</Td>
                                    <Td>{sak.personIdent}</Td>
                                    <Td>{sak.navn.visningsnavn}</Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            } else {
                return <div>Fant ikke noen saker</div>;
            }
        default:
            return <div>Har ikke hentet saker</div>;
    }
};

export default SakListe;
