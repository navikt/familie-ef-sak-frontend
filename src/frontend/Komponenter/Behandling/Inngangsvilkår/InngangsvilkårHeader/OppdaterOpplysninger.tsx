import React, { useState } from 'react';
import styled from 'styled-components';
import { Refresh } from '@navikt/ds-icons';
import { Button, HelpText } from '@navikt/ds-react';
import { DetailSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';
import { useBehandling } from '../../../../App/context/BehandlingContext';

const FlexWrapper = styled.div`
    display: flex;
    align-items: baseline;
`;
const Container = styled.div`
    display: flex;
    margin: 2rem;
    align-items: center;
    .knapp__spinner {
        margin: 0 !important;
    }
`;

const Oppdateringstekst = styled(DetailSmall)`
    color: ${ATextSubtle};
    padding-right: 0.25rem;
`;

const KnappTekst = styled(SmallTextLabel)`
    padding-left: 0rem;
`;

type Props = {
    oppdatertDato: string;
    behandlingErRedigerbar: boolean;
    oppdaterGrunnlagsdata: (behandlingId: string) => Promise<void>;
    behandlingId: string;
};

export const OppdaterOpplysninger: React.FC<Props> = ({
    oppdatertDato,
    behandlingErRedigerbar,
    oppdaterGrunnlagsdata,
    behandlingId,
}) => {
    const { nullstillGrunnlagsendringer } = useBehandling();
    const [nyGrunnlagsdataHentes, settNyGrunnlagsdataHentes] = useState(false);
    const grunnlagsdataSistOppdatert = 'Opplysninger hentet fra Folkeregisteret ' + oppdatertDato;

    React.useEffect(() => {
        settNyGrunnlagsdataHentes(false);
    }, [oppdatertDato]);

    return behandlingErRedigerbar ? (
        <FlexWrapper>
            <Container>
                <Oppdateringstekst children={grunnlagsdataSistOppdatert} />
                <Button
                    aria-label={'Oppdater registeropplysninger'}
                    title={'Oppdater'}
                    onClick={() => {
                        if (!nyGrunnlagsdataHentes) {
                            settNyGrunnlagsdataHentes(true);
                            oppdaterGrunnlagsdata(behandlingId).then(() =>
                                nullstillGrunnlagsendringer()
                            );
                        }
                    }}
                    loading={nyGrunnlagsdataHentes}
                    variant={'tertiary'}
                    size={'small'}
                >
                    <Refresh role="img" focusable="false" /> <KnappTekst>Oppdater</KnappTekst>
                </Button>
                <HelpText>
                    Dersom søker har fått et nytt barn etter å ha sendt inn denne søknaden vil ikke
                    dette bli tatt med i oppdateringen.
                </HelpText>
            </Container>
        </FlexWrapper>
    ) : (
        <></>
    );
};
