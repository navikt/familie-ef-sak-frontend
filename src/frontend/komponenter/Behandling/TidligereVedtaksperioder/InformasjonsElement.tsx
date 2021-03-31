import * as React from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { FlexDiv } from '../../Oppgavebenk/OppgaveFiltrering';
import styled from 'styled-components';

const FloatRight = styled.div`
    float: right;
    width: ${(props: { width?: string }) => props.width ?? '50%'};
    padding: 1rem 0;
`;

const FloatLeft = styled.div`
    float: left;
    width: ${(props: { width?: string }) => props.width ?? '50%'};
    padding: 1rem 0;
`;

interface Props {
    tittel: string;
    spørsmåltekst: string;
    spørsmålsvar: string;
    hjelpetekst?: string;
}

const InformasjonsElement: React.FC<Props> = ({
    tittel,
    spørsmålsvar,
    spørsmåltekst,
    hjelpetekst,
}) => {
    const Spørsmål = (props: { spørsmåltekst: string; hjelpetekst?: string }) => (
        <>
            <Element className="blokk-s">
                {props.spørsmåltekst}
                {props.hjelpetekst && (
                    <Normaltekst
                        style={{ marginLeft: '0.25rem' }}
                        tag="span"
                        children={props.hjelpetekst}
                    />
                )}
            </Element>
        </>
    );

    return (
        <FlexDiv>
            <FloatLeft>
                <Systemtittel>{tittel}</Systemtittel>
            </FloatLeft>
            <FloatRight>
                <Spørsmål spørsmåltekst={spørsmåltekst} hjelpetekst={hjelpetekst} />
                <Normaltekst>{spørsmålsvar}</Normaltekst>
            </FloatRight>
        </FlexDiv>
    );
};

export default InformasjonsElement;
