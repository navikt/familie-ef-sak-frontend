import React, { useState } from 'react';
import styled from 'styled-components';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { Refresh } from '@navikt/ds-icons';
import { FamilieKnapp } from '@navikt/familie-form-elements';

const Container = styled.div`
    display: flex;
    margin: 2rem;
    align-items: center;
    .knapp__spinner {
        margin: 0 !important;
    }
`;

const Oppdateringstekst = styled(Undertekst)`
    color: ${navFarger.navGra60};
    padding-right: 0.25rem;
`;

const KnappTekst = styled(Element)`
    padding-left: 0.25rem;
`;

type Props = {
    oppdatertDato: string;
    behandlingErRedigerbar: boolean;
    oppdaterGrunnlagsdata: (behandlingId: string) => void;
    behandlingId: string;
};

export const OppdaterOpplysninger: React.FC<Props> = ({
    oppdatertDato,
    behandlingErRedigerbar,
    oppdaterGrunnlagsdata,
    behandlingId,
}) => {
    const [nyGrunnlagsdataHentes, settNyGrunnlagsdataHentes] = useState(false);
    const grunnlagsdataSistOppdatert = 'Opplysninger hentet fra Folkeregisteret ' + oppdatertDato;

    React.useEffect(() => {
        settNyGrunnlagsdataHentes(false);
    }, [oppdatertDato]);

    return (
        <Container>
            <Oppdateringstekst children={grunnlagsdataSistOppdatert} />
            <FamilieKnapp
                aria-label={'Oppdater registeropplysninger'}
                title={'Oppdater'}
                onClick={() => {
                    if (!nyGrunnlagsdataHentes) {
                        settNyGrunnlagsdataHentes(true);
                        oppdaterGrunnlagsdata(behandlingId);
                    }
                }}
                spinner={nyGrunnlagsdataHentes}
                type={'flat'}
                mini={true}
                kompakt={true}
                erLesevisning={!behandlingErRedigerbar}
            >
                <Refresh role="img" focusable="false" /> <KnappTekst>Oppdater</KnappTekst>
            </FamilieKnapp>
        </Container>
    );
};
