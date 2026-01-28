import React from 'react';
import '@navikt/ds-css';
import { ActionMenu, InternalHeader as NavHeader } from '@navikt/ds-react';
import { MenuGridIcon, WrenchIcon } from '@navikt/aksel-icons';
import { EksternLinkIkon } from '@navikt/familie-ikoner';
import clsx from 'clsx';
import './header.css';

export interface Brukerinfo {
    navn: string;
    enhet?: string;
}

export enum LenkeType {
    INTERN = 'INTERN',
    EKSTERN = 'EKSTERN',
    ARBEIDSVERKTØY = 'ARBEIDSVERKTØY',
}

export type PopoverItem =
    | {
          name: string;
          href: string;
          type?: LenkeType;
          isExternal?: boolean;
          onSelect?: never;
      }
    | {
          name: string;
          href?: never;
          type?: LenkeType;
          isExternal?: never;
          onSelect: (e: Event) => void;
      };

export interface HeaderProps {
    tittel: string;
    brukerinfo: Brukerinfo;
    tittelHref?: string;
    children?: React.ReactNode | React.ReactNode[];
    brukerPopoverDetail?: React.ReactNode;
    brukerPopoverItems?: PopoverItem[];
    eksterneLenker: PopoverItem[];
    tittelOnClick?: () => void;
    erDev?: boolean;
}

interface BrukerProps {
    navn: string;
    enhet?: string;
    popoverDetail?: React.ReactNode;
    popoverItems?: PopoverItem[];
}

interface LenkePopoverProps {
    lenker: PopoverItem[];
}

export const Bruker = ({ navn, enhet, popoverItems, popoverDetail }: BrukerProps) => {
    return (
        <ActionMenu>
            <ActionMenu.Trigger>
                <NavHeader.UserButton
                    name={navn}
                    description={enhet ? `Enhet: ${enhet}` : 'Ukjent enhet'}
                    className="ml-auto"
                />
            </ActionMenu.Trigger>
            {(popoverItems || popoverDetail) && (
                <ActionMenu.Content>
                    {popoverDetail}
                    {popoverDetail && popoverItems && <ActionMenu.Divider />}
                    {popoverItems && (
                        <ActionMenu.Group label={''}>
                            {popoverItems.map((lenke, index) => {
                                return <ActionMenuLenke key={index} lenke={lenke} />;
                            })}
                        </ActionMenu.Group>
                    )}
                </ActionMenu.Content>
            )}
        </ActionMenu>
    );
};

export const LenkePopover = ({ lenker }: LenkePopoverProps) => (
    <ActionMenu>
        <ActionMenuTrigger />
        {lenker && (
            <ActionMenu.Content>
                <ActionMenu.Group label={''}>
                    {lenker.map((lenke, index) => (
                        <ActionMenuLenke lenke={lenke} key={index} />
                    ))}
                </ActionMenu.Group>
            </ActionMenu.Content>
        )}
    </ActionMenu>
);

const ActionMenuMedLabelOgIkoner: React.FC<{
    lenker: PopoverItem[];
}> = ({ lenker }) => {
    const eksterneLenker = lenker.filter((lenke) => lenke.type === LenkeType.EKSTERN);
    const arbeidsverktøyLenker = lenker.filter((lenke) => lenke.type === LenkeType.ARBEIDSVERKTØY);
    const interneLenker = lenker.filter((lenke) => lenke.type === LenkeType.INTERN);
    return (
        <ActionMenu>
            <ActionMenuTrigger />
            {lenker && (
                <ActionMenu.Content>
                    {eksterneLenker.length > 0 && (
                        <ActionMenu.Group label="Eksterne lenker">
                            {eksterneLenker.map((lenke) => (
                                <ActionMenuLenke lenke={lenke} key={lenke.name} />
                            ))}
                        </ActionMenu.Group>
                    )}
                    {arbeidsverktøyLenker.length > 0 && (
                        <ActionMenu.Group label="Lenker til arbeidsverktøy">
                            {arbeidsverktøyLenker.map((lenke) => (
                                <ActionMenuLenke lenke={lenke} key={lenke.name} />
                            ))}
                        </ActionMenu.Group>
                    )}
                    {interneLenker.length > 0 && (
                        <ActionMenu.Group label="Andre funksjoner">
                            {interneLenker.map((lenke) => (
                                <ActionMenuLenke lenke={lenke} key={lenke.name} />
                            ))}
                        </ActionMenu.Group>
                    )}
                </ActionMenu.Content>
            )}
        </ActionMenu>
    );
};

const ActionMenuLenke: React.FC<{
    lenke: PopoverItem;
}> = ({ lenke }) => {
    return lenke.onSelect ? (
        <ActionMenu.Item onSelect={(e) => lenke.onSelect && lenke.onSelect(e)}>
            {utledIkon(lenke.type)}
            {lenke.name}
        </ActionMenu.Item>
    ) : (
        <ActionMenu.Item as={'a'} href={lenke.href}>
            {utledIkon(lenke.type)}
            {lenke.name}
        </ActionMenu.Item>
    );
};

const utledIkon = (lenkeType?: LenkeType) => {
    switch (lenkeType) {
        case LenkeType.INTERN:
            return <></>;
        case LenkeType.EKSTERN:
            return <EksternLinkIkon width={16} height={16} />;
        case LenkeType.ARBEIDSVERKTØY:
            return <WrenchIcon width={16} height={16} />;
        default:
            return <></>;
    }
};

export const Header = ({
    tittel,
    children,
    brukerinfo,
    tittelHref = '/',
    brukerPopoverDetail,
    brukerPopoverItems,
    eksterneLenker = [],
    tittelOnClick,
    erDev,
}: HeaderProps) => {
    const skalViseLabelOgIkon = (type: LenkeType | undefined) =>
        type === LenkeType.EKSTERN || type === LenkeType.ARBEIDSVERKTØY;
    const skalViseLabelsOgIkonPåLenker = eksterneLenker.some((lenke) =>
        skalViseLabelOgIkon(lenke.type)
    );

    return (
        <NavHeader data-theme={''} className={clsx({ devHeader: erDev })}>
            {!tittelOnClick && <NavHeader.Title href={tittelHref}>{tittel}</NavHeader.Title>}
            {tittelOnClick && (
                <NavHeader.Title onClick={tittelOnClick} style={{ cursor: 'pointer' }}>
                    {tittel}
                </NavHeader.Title>
            )}
            <div style={{ marginLeft: 'auto' }} />
            {children}
            {eksterneLenker.length > 0 &&
                (skalViseLabelsOgIkonPåLenker ? (
                    <ActionMenuMedLabelOgIkoner lenker={eksterneLenker} />
                ) : (
                    <LenkePopover lenker={eksterneLenker} />
                ))}

            <Bruker
                navn={brukerinfo.navn}
                enhet={brukerinfo.enhet}
                popoverDetail={brukerPopoverDetail}
                popoverItems={brukerPopoverItems}
            />
        </NavHeader>
    );
};

const ActionMenuTrigger = () => {
    return (
        <ActionMenu.Trigger>
            <NavHeader.Button className="ml-auto">
                <MenuGridIcon fontSize={'1.5rem'} title="Andre systemer" />
            </NavHeader.Button>
        </ActionMenu.Trigger>
    );
};
