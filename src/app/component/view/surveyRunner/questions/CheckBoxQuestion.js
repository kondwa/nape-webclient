import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "prop-types";
import React from "react";
import {createSelectionAnswer} from "../../../../common/utils/QuestionUtils";
import find from "lodash/find";
import map from "lodash/map";
import {withStyles} from "@material-ui/core";

const styles = () => ({
    control: {
        margin: "0 55px",
    },
    label: {
        alignItems: "flex-start"
    },
    icon: {
        padding: "0 12px"
    }
});

class CheckBoxQuestion extends React.Component {

    static propTypes = {
        question: PropTypes.object,
        add: PropTypes.func,
        remove: PropTypes.func,
        readOnly: PropTypes.bool.isRequired,
        activateTriggers: PropTypes.func,
        classes: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            activeCheckbox: []
        };

        this.handleChange = ::this.handleChange;
        this.checkForChecked = ::this.checkForChecked;
    }

    handleChange(option, isChecked) {

        const {add, remove, activateTriggers, question} = this.props;

        let answer = question.answers.length > 0 ? find(question.answers, (a) => a.answer && a.answer.value === option.name) : undefined;

        if (answer) {
            if (!isChecked) {
                remove(question, answer);
            }
        } else {
            if (isChecked) {
                let selectionAnswer = createSelectionAnswer(option, true);
                add(question, selectionAnswer);
            }
        }

        activateTriggers(question);
    }

    render() {
        const {question, readOnly, classes} = this.props;

        return (
            <div>

                <FormControl
                    margin="normal"
                    className={classes.control}
                >

                    {question && question.options.map(option => (

                        <FormControlLabel
                            key={option.graphId}
                            className={classes.label}
                            disabled={readOnly}
                            label={option.name}
                            control={
                                <Checkbox
                                    disabled={readOnly}
                                    value={option.name}
                                    className={classes.icon}
                                    checked={map(question.answers, "answer.value").includes(option.name)}
                                    onChange={(e, isChecked) => {
                                        this.handleChange(option, isChecked);
                                    }}
                                />
                            }
                        />
                    ))}
                </FormControl>

            </div>

        );
    }

    checkForChecked(choice) {
        let result = choice.choices.find(d => d.name === choice.value);
        return result.text !== "";
    }
}

export default withStyles(styles)(CheckBoxQuestion);
