import Quill from 'quill';
import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';
import { BlockBlot } from 'parchment';
import { AlertError } from '../Visningskomponenter/Alerts';

type Props = {
    defaultValue?: string;
    onTextChange: (html: string, renTekst: string) => void;
};

/**
 * Overstyre default tag fra `p` til `div` ettersom `p` gir noen uheldige sideeffekter med mellomrom i tekstene våre.
 */
const Block = Quill.import('blots/block') as BlockBlot;
// @ts-expect-error Utypet kode - usikkert hvordan vi får dette til
Block.tagName = 'div';
// @ts-expect-error Utypet kode - usikkert hvordan vi får dette til
Quill.register(Block);

export const HtmlEditor = forwardRef(({ defaultValue, onTextChange }: Props, ref) => {
    const defaultValueRef = useRef(defaultValue);
    const containerRef = useRef<HTMLDivElement>(null);
    const onTextChangeRef = useRef(onTextChange);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const verktøySomSkalMed = [[{ list: 'bullet' }], ['clean']];

        const quill = new Quill(editorContainer, {
            theme: 'snow',
            modules: {
                toolbar: verktøySomSkalMed,
            },
        });

        if (ref && typeof ref === 'function') {
            ref(quill);
        } else if (ref && 'current' in ref) {
            (ref as React.MutableRefObject<Quill | null>).current = quill;
        }

        if (defaultValueRef.current) {
            const htmlAsDelta = quill.clipboard.convert({ html: defaultValueRef.current });
            quill.setContents(htmlAsDelta);
        }

        quill.on('text-change', () => {
            const html = quill.root.innerHTML;
            const text = quill.getText();

            onTextChangeRef.current(html, text);
        });

        return () => {
            if (ref && 'current' in ref) {
                (ref as React.MutableRefObject<Quill | null>).current = null;
            }
            container.innerHTML = '';
        };
    }, [ref]);

    return containerRef ? (
        <div ref={containerRef}></div>
    ) : (
        <AlertError>En uventet feil oppstod ved opprettelse av tekstfelt.</AlertError>
    );
});

HtmlEditor.displayName = 'HtmlEditor';
