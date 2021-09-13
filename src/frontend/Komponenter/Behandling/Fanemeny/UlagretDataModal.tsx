import React, { FC } from 'react';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';
import { Knapp } from 'nav-frontend-knapper';
import { ISide } from './sider';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const StyledKnapp = styled(Knapp)`
    margin-left: 3rem;
`;

interface Props {
    visModal: boolean;
    aktivSide: ISide | undefined;
    valgtSide: ISide | undefined;
    settVisModal: (visModal: boolean) => void;
}

const UlagretDataModal: FC<Props> = ({ visModal, aktivSide, valgtSide, settVisModal }) => {
    const { settAntallIRedigeringsmodus } = useBehandling();
    const history = useHistory();

    return (
        <UIModalWrapper
            modal={{
                tittel: 'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden.',
                lukkKnapp: false,
                visModal: visModal,
                onClose: () => settVisModal(false),
                className: 'cake',
            }}
        >
            <Knapp
                key={'Forlat siden'}
                type={'standard'}
                onClick={() => {
                    if (valgtSide && aktivSide) {
                        settAntallIRedigeringsmodus(0);
                        const valgtSidePath = history.location.pathname.replace(
                            aktivSide.href,
                            valgtSide.href
                        );
                        history.push(valgtSidePath);
                    }
                    settVisModal(false);
                }}
            >
                Forlat siden
            </Knapp>
            <StyledKnapp
                key={'Gå tilbake'}
                type={'hoved'}
                onClick={() => {
                    settVisModal(false);
                }}
            >
                Gå tilbake for å lagre
            </StyledKnapp>
        </UIModalWrapper>
    );
};

export default UlagretDataModal;
