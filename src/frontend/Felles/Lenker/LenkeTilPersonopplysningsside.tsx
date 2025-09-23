import React, { ReactNode } from 'react';
import { HStack, Link, Tag } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import { EToast } from '../../App/typer/toast';
import { erNPID } from '../HeaderMedSøk/utils';

interface IProps {
    personIdent?: string;
    children: ReactNode;
}

export const LenkeTilPersonopplysningsside: React.FC<IProps> = ({ personIdent, children }) => {
    const { axiosRequest, settToast } = useApp();

    const redirectTilPersonopplysningsside = (personIdent: string) => {
        axiosRequest<string, { personIdent: string }>({
            method: 'POST',
            url: `/familie-ef-sak/api/fagsak-person`,
            data: { personIdent: personIdent },
        }).then((res: Ressurs<string>) => {
            if (res.status === RessursStatus.SUKSESS) {
                window.open(
                    `${window.location.origin}/person/${res.data}/personopplysninger`,
                    '_blank'
                );
            } else {
                settToast(EToast.REDIRECT_ANNEN_RELASJON_FEILET);
            }
        });
    };

    if (!personIdent) {
        return <>{children}</>;
    }

    if (erNPID(personIdent)) {
        return (
            <HStack gap="2" align={'center'}>
                <BodyShortSmall>{children}</BodyShortSmall>{' '}
                <Tag variant="info" size="small">
                    NPID
                </Tag>
            </HStack>
        );
    }

    return (
        <BodyShortSmall>
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    redirectTilPersonopplysningsside(personIdent);
                }}
            >
                {children} <ExternalLinkIcon title="Gå til person" />
            </Link>
        </BodyShortSmall>
    );
};
