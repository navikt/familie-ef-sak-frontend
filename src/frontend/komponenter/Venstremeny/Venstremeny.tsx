import * as React from 'react';
import Lenke from 'nav-frontend-lenker';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../../typer/routing';

const StyledVenstremeny = styled.nav``;

const Venstremeny: React.FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();
    return (
        <StyledVenstremeny>
            <ul>
                <li>
                    <Lenke href={'personopplysninger'}>Personopplysninger</Lenke>
                </li>
                <li>
                    <Lenke href={'inngangsvilkar'}>Inngangsvilkår</Lenke>
                </li>
                <li>
                    <Lenke href={'overgangsstonad'}>Overgansstønad</Lenke>
                </li>
            </ul>
        </StyledVenstremeny>
    );
};

export default Venstremeny;
