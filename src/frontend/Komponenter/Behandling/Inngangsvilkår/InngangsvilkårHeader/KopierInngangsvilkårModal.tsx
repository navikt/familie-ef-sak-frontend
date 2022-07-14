import React from 'react';
import UIModalWrapper from '../../../../Felles/Modal/UIModalWrapper';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { useApp } from '../../../../App/context/AppContext';
import { EToast } from '../../../../App/typer/toast';

export const KnappeWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 1rem;
`;

export const StyledHovedknapp = styled(Button)`
    margin-right: 1rem;
`;

interface IProps {
    visModal: boolean;
    settVisModal: (bool: boolean) => void;
    behandlingId: string;
    kopierBehandlingId: string;
    gjenbrukInngangsvilkår: (behandlingId: string, kopierBehandlingId: string) => void;
}

const KopierInngangsvilkårModal: React.FunctionComponent<IProps> = ({
    visModal,
    settVisModal,
    behandlingId,
    kopierBehandlingId,
    gjenbrukInngangsvilkår,
}) => {
    const { settToast } = useApp();

    const kopierInngangsvilkår = (behandlingId: string, kopierBehandlingId: string) => {
        settVisModal(false);
        settToast(EToast.INNGANGSVILKÅR_GJENBRUKT);
        gjenbrukInngangsvilkår(behandlingId, kopierBehandlingId);
    };

    return (
        <UIModalWrapper
            modal={{
                tittel: '',
                lukkKnapp: true,
                visModal: visModal,
                onClose: () => settVisModal(false),
            }}
        >
            <Normaltekst>
                Er du sikker på at du vil gjenbruke vilkårsvurdering fra tidligere behandling?
                Inngangsvilkår du allerede har vurdert i inneværende behandling vil bli overskrevet.
            </Normaltekst>
            <KnappeWrapper>
                <StyledHovedknapp
                    variant="primary"
                    size="small"
                    onClick={() => kopierInngangsvilkår(behandlingId, kopierBehandlingId)}
                >
                    Gjenbruk vilkårsvurdering
                </StyledHovedknapp>
                <Button variant="tertiary" size="small" onClick={() => settVisModal(false)}>
                    Avbryt
                </Button>
            </KnappeWrapper>
        </UIModalWrapper>
    );
};

export default KopierInngangsvilkårModal;
