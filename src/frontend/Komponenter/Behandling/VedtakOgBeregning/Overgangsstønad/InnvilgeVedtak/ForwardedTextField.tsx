import React, { forwardRef } from 'react';
import { TextField, TextFieldProps } from '@navikt/ds-react'; // Adjust the import path as needed

const ForwardedTextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
    return <TextField {...props} ref={ref} />;
});

ForwardedTextField.displayName = 'ForwardedTextField';
export default ForwardedTextField;
