import React from 'react';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import IkkeVurdert from '../../../Felles/Ikoner/IkkeVurdert';
import Oppfylt from '../../../Felles/Ikoner/Oppfylt';
import { Undertittel } from 'nav-frontend-typografi';
import styled from 'styled-components';

interface Props {
    behandlingId: string;
}

const FlexDiv = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const ÅrsakRevurdering: React.FC<Props> = () => {
    return (
        <ToKolonnerLayout skillelinje={false}>
            {{
                venstre: (
                    <FlexDiv>
                        <ÅrsakRevurderingIkon oppfylt={true} />
                        <Undertittel>Årsak til revurdering</Undertittel>
                    </FlexDiv>
                ),
                høyre: <></>,
            }}
        </ToKolonnerLayout>
    );
};

const ÅrsakRevurderingIkon: React.FC<{ oppfylt: boolean }> = ({ oppfylt }) =>
    oppfylt ? <Oppfylt heigth={23} width={21} /> : <IkkeVurdert heigth={23} width={21} />;
