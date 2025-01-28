import React from 'react';
import { IBrevverdier, useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AlertInfo } from '../../../Felles/Visningskomponenter/Alerts';

export const OverstyrtBrevmalVarsel: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { mellomlagretBrev } = useMellomlagringBrev(behandlingId);

    return (
        <DataViewer
            response={{
                mellomlagretBrev,
            }}
        >
            {({ mellomlagretBrev }) => {
                const brevVerdier =
                    mellomlagretBrev && mellomlagretBrev.brevverdier
                        ? (JSON.parse(mellomlagretBrev.brevverdier) as IBrevverdier)
                        : undefined;
                const delmalNøkler = Object.keys(
                    brevVerdier?.overstyrteDelmalerFraMellomlager || {}
                );
                const harOverstyrtBrevmaler = delmalNøkler
                    .filter(
                        (delmalKey) =>
                            brevVerdier?.overstyrteDelmalerFraMellomlager[delmalKey].skalOverstyre
                    )
                    .some(
                        (delmalKey) => brevVerdier?.valgteDelmalerFraMellomlager[delmalKey] === true
                    );

                return harOverstyrtBrevmaler ? (
                    <AlertInfo>
                        Saksbehandler har overstyrt en eller flere brevmaler i vedtaksbrevet.
                    </AlertInfo>
                ) : null;
            }}
        </DataViewer>
    );
};
