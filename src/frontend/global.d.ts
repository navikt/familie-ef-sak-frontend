/// <reference types="vite/client" />
/// <reference types="@navikt/ds-react/esm/types/theme" />

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
