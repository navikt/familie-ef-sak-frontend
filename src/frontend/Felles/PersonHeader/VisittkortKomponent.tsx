import * as React from 'react';
import { CopyButton, HStack, Label } from '@navikt/ds-react';
import { PersonIcon } from '@navikt/aksel-icons';
export interface IProps extends React.PropsWithChildren {
    alder: number;
    ident: string;
    navn: string | React.ReactNode;
    ikon?: React.ReactElement;
    dempetKantlinje?: boolean;
    padding?: boolean;
    borderBottom?: boolean;
}

export const VisittKortKomponent: React.FunctionComponent<IProps> = ({
    alder,
    ident,
    navn,
    ikon,
}) => {
    return (
        <HStack align="center" justify="space-between" gap="space-16" padding="space-8">
            <HStack align="center" gap="space-16">
                {ikon ? ikon : <PersonIcon title="a11y-title" fontSize="1.5rem" />}
                {typeof navn === 'string' ? (
                    <Label size={'small'}>
                        {navn} ({alder} år)
                    </Label>
                ) : (
                    navn
                )}
                <div>|</div>
                <HStack align="center" gap="space-4">
                    {ident}
                    <CopyButton copyText={ident.replace(' ', '')} size={'small'} />
                </HStack>
            </HStack>
        </HStack>
    );
};

export default VisittKortKomponent;
