import * as React from 'react';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { useApp } from '../../../context/AppContext';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';

const Footer = styled.div`
    position: fixed;
    bottom: 0;
    right: -10;
    width: 100%;
    background-color: ${navFarger.navGra80};
`;

const MittstildtInnhold = styled.div`
    width: 30%;
    margin: 0 auto;
    display flex;
`;

const Brev: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();

    const sendTilBeslutter = () =>
        axiosRequest<string, undefined>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedlegg/${behandlingId}/send-til-beslutter`,
        }).then((res: Ressurs<string>) => {
            if (res.status === RessursStatus.SUKSESS) {
                window.alert('Det gikk bra!');
            } else {
                window.alert('Det gikk mindre bra! :(((');
            }
        });

    return (
        <div>
            <Footer>
                <MittstildtInnhold>
                    <Knapp>Lagre</Knapp>
                    <Hovedknapp onClick={sendTilBeslutter}>Send til beslutter</Hovedknapp>
                </MittstildtInnhold>
            </Footer>
        </div>
    );
};

export default Brev;
