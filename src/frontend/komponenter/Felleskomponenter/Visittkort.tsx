import React, { FC, ReactElement, ReactNode } from 'react';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import FamilieVisittkort from '@navikt/familie-visittkort';
import DataViewer from './DataViewer/DataViewer';
import styled from 'styled-components';
import { Ressurs } from '../../typer/ressurs';

export const VisittkortWrapper = styled.div`
    .visittkort {
        padding: 0 1.5rem;
    }
`;

const Visittkort: FC<{ personOpplysninger: IPersonopplysninger }> = ({ personOpplysninger }) => (
    <FamilieVisittkort
        alder={20}
        ident={personOpplysninger.personIdent}
        kjønn={personOpplysninger.kjønn}
        navn={personOpplysninger.navn.visningsnavn}
    />
);

interface VisittkortProps {
    data: Ressurs<IPersonopplysninger>;
    children?: ((data: IPersonopplysninger) => React.ReactElement) | ReactNode;
}

const VisittkortComponent = (props: VisittkortProps): ReactElement<VisittkortProps> => {
    const { data, children } = props;
    const renderChildren = (personOpplysninger: IPersonopplysninger) => {
        if (typeof children === 'function') {
            return <>{children(personOpplysninger)}</>;
        }
        return <>{children}</>;
    };

    return (
        <DataViewer response={data}>
            {(personOpplysninger) => (
                <>
                    <VisittkortWrapper>
                        <Visittkort personOpplysninger={personOpplysninger} />
                    </VisittkortWrapper>
                    {renderChildren(personOpplysninger)}
                </>
            )}
        </DataViewer>
    );
};

export default VisittkortComponent;
