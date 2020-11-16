import React from 'react';
import { ITelefonnummer } from '../../../typer/personopplysninger';
import { StyledInnholdWrapper, TabellWrapper } from './TabellWrapper';
import styled from 'styled-components';
import Telefon from '../../../ikoner/Telefon';
import { Undertittel } from 'nav-frontend-typografi';
import SvartNavIkon from '../../../ikoner/SvartNavIkon';

const StyledGridDiv = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 'telefonTittel enhet .';

    grid-area: tittel;
`;

const StyledTelefonIkonWrapper = styled.div`
    justify-self: left;
    align-self: flex-end;

    grid-area: ikon;
`;

const StyledTittel = styled(Undertittel)`
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    grid-area: telefonTittel;
`;

const StyledNavEnhetWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        'navIkon navKontorTittel'
        '. navKontor';

    grid-area: enhet;
    justify-self: center;
`;

const StyledEnhet = styled.div`
    grid-area: navKontor;
    align-items: flex-end;
    justify-content: flex-start;
`;

const StyledNavkontorTittel = styled(Undertittel)`
    display: flex;
    align-items: center;
`;

const StyledNavIkonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 1rem;
`;

export const PersonopplysningerHeader: React.FC<{ telefon?: ITelefonnummer; navEnhet: string }> = ({
    telefon,
    navEnhet,
}) => {
    return (
        <TabellWrapper>
            <StyledTelefonIkonWrapper>
                <Telefon />
            </StyledTelefonIkonWrapper>
            <StyledGridDiv>
                <StyledTittel>Telefonnummer</StyledTittel>
                <StyledNavEnhetWrapper>
                    <StyledNavIkonWrapper>
                        <SvartNavIkon />
                    </StyledNavIkonWrapper>
                    <StyledNavkontorTittel>NAV-Kontor</StyledNavkontorTittel>
                    <StyledEnhet>{navEnhet}</StyledEnhet>
                </StyledNavEnhetWrapper>
            </StyledGridDiv>
            <StyledInnholdWrapper>
                {telefon ? `+${telefon.landskode} ${telefon.nummer}` : '-'}
            </StyledInnholdWrapper>
        </TabellWrapper>
    );
};
