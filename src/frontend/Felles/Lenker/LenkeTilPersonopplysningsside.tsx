import React, { ReactNode } from 'react';
import { Link } from '@navikt/ds-react';
import { ExternalLink } from '@navikt/ds-icons';
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

    return personIdent ? (
        <BodyShortSmall>
            <Link
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    redirectTilPersonopplysningsside(personIdent);
                }}
            >
                {children} <ExternalLink title="Gå til person" />
            </Link>
        </BodyShortSmall>
    ) : (
        <>{children}</>
    );
};
