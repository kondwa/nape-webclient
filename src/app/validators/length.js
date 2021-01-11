const defaultConfiguration = {
    value: 1000,
    messageKey: "validator.length"
};

function lengthValidator(value, configuration = defaultConfiguration) {

    let mergedConfiguration = Object.assign({}, defaultConfiguration, configuration);

    if( typeof value !== "string") {
        return {
            valid : false,
            messageKey: "validator.incompatible-types"
        };
    }

    if(value.length > mergedConfiguration.value) {
        return {
            valid : false,
            messageKey : mergedConfiguration.messageKey
        };
    } else {
        return {
            valid : true
        };
    }

}

export { defaultConfiguration as lengthValidatorConfiguration, lengthValidator };
