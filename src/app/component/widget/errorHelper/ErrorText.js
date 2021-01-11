import FormHelperText from "@material-ui/core/FormHelperText";
import React from "react";

const ErrorText = ( errorText ) => {
    return (
        errorText.text ?
            <FormHelperText style={{ color: "red" }}>
                {errorText.text}</FormHelperText>
            : null
    );
};

export default ErrorText;
