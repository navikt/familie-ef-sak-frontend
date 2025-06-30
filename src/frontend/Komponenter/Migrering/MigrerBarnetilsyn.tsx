import React, { useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { Button, Heading } from '@navikt/ds-react';
import { visMigrertStatus } from './MigrerFagsak';

const MigrerBarnetilsyn: React.FC<{
    fagsakPersonId: string;
}> = ({ fagsakPersonId }) => {
    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [migrertStatus, settMigrertStatus] = useState<Ressurs<string>>(byggTomRessurs());
    const [ignorerFeilISimulering, settIgnorerFeilISimulering] = useState<boolean>();

    if (!toggles[ToggleName.kanMigrereBarnetilsyn]) {
        return null;
    }

    const migrerFagsak = () => {
        settMigrertStatus(byggHenterRessurs());
        axiosRequest<string, { ignorerFeilISimulering?: boolean }>({
            method: 'POST',
            url: `/familie-ef-sak/api/migrering/${fagsakPersonId}/barnetilsyn`,
            data: {
                ignorerFeilISimulering,
            },
        }).then((res: Ressurs<string>) => {
            settMigrertStatus(res);
        });
    };

    return (
        <>
            <Heading size={'medium'}>Migrering - Barnetilsyn</Heading>
            <div>
                {visMigrertStatus(migrertStatus, settIgnorerFeilISimulering)}
                <Button
                    onClick={migrerFagsak}
                    disabled={
                        migrertStatus.status === RessursStatus.HENTER ||
                        migrertStatus.status === RessursStatus.SUKSESS
                    }
                >
                    Migrer Barnetilsyn
                </Button>
            </div>
        </>
    );
};

export default MigrerBarnetilsyn;
