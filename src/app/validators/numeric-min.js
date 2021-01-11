const defaultConfiguration = {
    messageKey: "validator.numeric-min",
    value: 0
};

function numericMinValidator(value, configuration = defaultConfiguration) {

    let mergedConfiguration = Object.assign({}, defaultConfiguration, configuration);

    if (value === "") {
        return {
            valid: true
        };
    }

    return {
        valid: value >= mergedConfiguration.value,
        messageKey: mergedConfiguration.messageKey
    };
}

export {defaultConfiguration as numericMinValidatorConfiguration, numericMinValidator};
