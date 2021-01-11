import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import ErrorText from "../../../widget/errorHelper/ErrorText";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import concat from "lodash/concat";
import {createValueAnswer} from "../../../../common/utils/QuestionUtils";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";

class TextQuestion extends Component {

    static propTypes = {
        question: PropTypes.object,
        id: PropTypes.number,
        add: PropTypes.func,
        validators: PropTypes.array.isRequired,
        defaultValidators: PropTypes.array.isRequired,
        readOnly: PropTypes.bool.isRequired,
        intl: intlShape.isRequired
    };

    static defaultProps = {
        value: "",
        validators: [],
        defaultValidators: []
    };

    constructor(props) {
        super(props);
        this.handleInputChange = :: this.handleInputChange;
        this.handleOnBlur = :: this.handleOnBlur;
        this.state = {
            inputValue: !isEmpty(this.props.question.answers) && find(this.props.question.answers).answer.value || "",
            inputErrorText: undefined,
            length: undefined,
            validators: concat(this.props.defaultValidators, this.props.validators)
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            inputValue: !isEmpty(nextProps.question.answers) && find(nextProps.question.answers).answer.value || "",
            inputErrorText: undefined,
            length: undefined,
            validators: concat(nextProps.defaultValidators, nextProps.validators)
        });
    }

    handleInputChange(event) {
        this.setState({
            inputValue: event.target.value
        });
    }

    handleOnBlur(question, event) {
        let newValue = event.target.value;
        const {add} = this.props;

        if (this.validate(newValue)) {

            if (question.answers.length > 0) {
                let oldAnswer = question.answers[0];
                oldAnswer.answer.value = newValue;
                add(question, null);
            } else {
                let newAnswer = createValueAnswer(newValue);
                add(question, newAnswer);
            }
        }
    }

    render() {
        const {question, id, readOnly} = this.props;

        return (
            <div>

                <TextField
                    error={!!this.state.inputErrorText}
                    id={`question-${id}-text`}
                    fullWidth
                    multiline
                    disabled={readOnly}
                    label={question.description}
                    type="text"
                    value={this.state.inputValue}
                    onChange={this.handleInputChange}
                    onBlur={(event) => this.handleOnBlur(question, event)}
                />

                <ErrorText text={this.state.inputErrorText}/>

            </div>
        );
    }

    validate(value) {

        let result = true;

        for (let i = 0; i < this.state.validators.length; i++) {

            let currentValidator = this.state.validators[i];
            let validationResult = currentValidator.validator(value, currentValidator.configuration);

            if (!validationResult.valid) {
                result = false;

                if (currentValidator.configuration.value) {
                    this.setState({
                        inputErrorText: this.props.intl.formatMessage({"id": currentValidator.configuration.messageKey}, {value: currentValidator.configuration.value})
                    });
                } else {
                    this.setState({
                        inputErrorText: this.props.intl.formatMessage({"id": currentValidator.configuration.messageKey})
                    });
                }

                break;
            }
        }

        return result;
    }
}

export default injectIntl(TextQuestion);
