import { Textarea } from 'nav-frontend-skjema';
import React, { useState } from 'react';

export const AvslåVedtak: React.FC = () => {
    const [avslåBegrunnelse, settAvslåBegrunnelse] = useState<string>('');

    return (
        <div style={{ marginTop: '2rem' }}>
            <Textarea
                value={avslåBegrunnelse}
                onChange={(e) => {
                    settAvslåBegrunnelse(e.target.value);
                }}
                label="Begrunnelse"
                maxLength={0}
            />
        </div>
    );
};
