import React, { useMemo, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { AxiosRequestConfig } from 'axios';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { IFagsakPerson } from '../../App/typer/fagsak';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { visMigrertStatus } from './MigrerFagsak';

const StyledKnapp = styled(Button)`
    margin: 0.25rem;
`;

const MigrerBarnetilsyn: React.FC<{
    fagsakPerson: IFagsakPerson;
}> = ({ fagsakPerson }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [migrertStatus, settMigrertStatus] = useState<Ressurs<string>>(byggTomRessurs());

    const { id: fagsakPersonId } = fagsakPerson;

    const migrerFagsakConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/migrering/${fagsakPersonId}/barnetilsyn`,
        }),
        [fagsakPersonId]
    );

    if (!toggles[ToggleName.kanMigrereBarnetilsyn]) {
        return null;
    }

    const migrerFagsak = () => {
        settMigrertStatus(byggHenterRessurs());
        axiosRequest<string, void>(migrerFagsakConfig).then((res: Ressurs<string>) => {
            settMigrertStatus(res);
        });
    };

    return (
        <div style={{ marginTop: '1rem' }}>
            <h1>Migrering - Barnetilsyn</h1>
            <div>
                {visMigrertStatus(migrertStatus)}
                <StyledKnapp
                    onClick={migrerFagsak}
                    disabled={
                        migrertStatus.status === RessursStatus.HENTER ||
                        migrertStatus.status === RessursStatus.SUKSESS
                    }
                >
                    Migrer Barnetilsyn
                </StyledKnapp>
            </div>
        </div>
    );
};

export default MigrerBarnetilsyn;
