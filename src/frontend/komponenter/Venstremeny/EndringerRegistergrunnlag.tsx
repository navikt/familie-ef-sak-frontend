import React, { FC } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';
import Advarsel from '../../ikoner/Advarsel';
import styled from 'styled-components';
import { RessursStatus } from '../../typer/ressurs';
import { useBehandling } from '../../context/BehandlingContext';

const UndertittelMedIkon = styled(Undertittel)`
    display: flex;

    > svg {
        padding-right: 0.25rem;
    }
`;

const EndringerBox = styled.div`
    padding-top: 1rem;
`;

const EndringerRegistergrunnlag: FC = () => {
    const { behandling } = useBehandling();
    if (behandling.status !== RessursStatus.SUKSESS) {
        return null;
    }
    const endringerRegistergrunnlag = behandling.data.endringerIRegistergrunnlag;
    if (!endringerRegistergrunnlag) {
        return null;
    }

    const endringer = Object.entries(endringerRegistergrunnlag)
        .filter(([, endringer]) => {
            return endringer.length > 0;
        })
        .map(([endringdel, endringer], index) => {
            return (
                <React.Fragment key={index}>
                    <Element>{endringdel}</Element>

                    {endringer.map((endring) => (
                        <div style={{ paddingLeft: '0.5rem' }}>{endring}</div>
                    ))}
                </React.Fragment>
            );
        });
    if (endringer.length === 0) {
        return null;
    }

    return (
        <EndringerBox>
            <UndertittelMedIkon>
                <Advarsel width={25} heigth={25} />
                Endringer
            </UndertittelMedIkon>
            <span>
                Følgende deler i inngangsvilkår har blitt endret. Godkjenn lengst ned under
                inngangsvilkår
            </span>
            {endringer}
        </EndringerBox>
    );
};

export default EndringerRegistergrunnlag;
