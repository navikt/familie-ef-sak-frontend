import React, { ReactNode } from 'react';
import { Link, Tag } from '@navikt/ds-react';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import { EToast } from '../../App/typer/toast';

interface IProps {
    personIdent?: string;
    children: ReactNode;
}

export const LenkeTilPersonopplysningsside: React.FC<IProps> = ({ personIdent, children }) => {
    const { axiosRequest, settToast } = useApp();

    const isNPID = (ident: string) => {
        if (ident.length !== 11) return false;
        const month = parseInt(ident.substring(2, 4), 10);
        if (month > 60 && month <= 72) return true;
        return month > 20 && month <= 32;
    };

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

    return !isNPID(personIdent) ? (
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
    ) : (
        <>
            {children}{' '}
            <Tag variant="success" size="small">
                NPID
            </Tag>
        </>
    );
};
