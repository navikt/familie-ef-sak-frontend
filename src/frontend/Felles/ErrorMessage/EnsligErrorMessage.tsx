import { ReactNode } from 'react';
import { ErrorMessage } from '@navikt/ds-react';
import React from 'react';

export const EnsligErrorMessage: React.FC<{ children: ReactNode | undefined }> = ({ children }) =>
    children ? <ErrorMessage>{children}</ErrorMessage> : null;
