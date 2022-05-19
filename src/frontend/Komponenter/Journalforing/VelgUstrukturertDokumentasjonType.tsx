import React from 'react';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';

const VelgUstrukturertDokumentasjonTypeSelect = styled(Select)`
    width: 10rem;
    margin: 1rem 0;
`;

export enum UstrukturertDokumentasjonType {
    SØKNAD = 'SØKNAD',
    ETTERSENDING = 'ETTERSENDNING',
}

const ustrukturertTypeTilTekst: Record<UstrukturertDokumentasjonType, string> = {
    SØKNAD: 'Søknad',
    ETTERSENDNING: 'Ettersendning',
};

const VelgUstrukturertDokumentasjonType: React.FC<{
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined;
    settUstrukturertDokumentasjonType: React.Dispatch<
        React.SetStateAction<UstrukturertDokumentasjonType | undefined>
    >;
}> = ({ ustrukturertDokumentasjonType, settUstrukturertDokumentasjonType }) => {
    return (
        <VelgUstrukturertDokumentasjonTypeSelect
            label="Type dokumentasjon"
            onChange={(e) => {
                if (e.target.value.trim() !== '') {
                    settUstrukturertDokumentasjonType(
                        e.target.value as UstrukturertDokumentasjonType
                    );
                } else {
                    settUstrukturertDokumentasjonType(undefined);
                }
            }}
            value={ustrukturertDokumentasjonType}
        >
            <option value={''}> Ikke valgt</option>
            {[UstrukturertDokumentasjonType.SØKNAD, UstrukturertDokumentasjonType.ETTERSENDING].map(
                (type) => (
                    <option key={type} value={type}>
                        {ustrukturertTypeTilTekst[type]}
                    </option>
                )
            )}
        </VelgUstrukturertDokumentasjonTypeSelect>
    );
};

export default VelgUstrukturertDokumentasjonType;
