const defaultConfiguration = {
    messageKey: "validator.numeric"
};

function numericValidator(value, configuration = defaultConfiguration) {

    let mergedConfiguration = Object.assign({}, defaultConfiguration, configuration);

    return {
        valid: !isNaN(value),
        messageKey: mergedConfiguration.messageKey
    };
}

export {defaultConfiguration as numericValidatorConfiguration, numericValidator};
