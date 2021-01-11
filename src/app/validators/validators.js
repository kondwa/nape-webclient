import { lengthValidator, lengthValidatorConfiguration } from "./length";
import { numericMinValidator, numericMinValidatorConfiguration } from "./numeric-min";
import { numericValidator, numericValidatorConfiguration } from "./numeric";

export default {
    lengthValidator : {
        validator: lengthValidator,
        configuration: lengthValidatorConfiguration
    },
    numericValidator : {
        validator: numericValidator,
        configuration: numericValidatorConfiguration
    },
    numericMinValidator : {
        validator: numericMinValidator,
        configuration: numericMinValidatorConfiguration
    }
};
