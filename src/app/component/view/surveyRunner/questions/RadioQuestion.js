import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import {createSelectionAnswer} from "../../../../common/utils/QuestionUtils";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
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

class RadioQuestion extends React.Component {

    static propTypes = {
        question: PropTypes.object,
        add: PropTypes.func,
        readOnly: PropTypes.bool.isRequired,
        activateTriggers: PropTypes.func,
        classes: PropTypes.object,
    };

    handleChange(name) {
        const {add, activateTriggers, question} = this.props;

        let option = find(question.options, (o) => o.name === name);

        if (option) {
            if (question.answers.length > 0) {
                let oldAnswer = question.answers[0];
                oldAnswer.answer.option = option;
                oldAnswer.answer.value = option.name;
                add(question, null);
            } else {
                let newAnswer = createSelectionAnswer(option);
                add(question, newAnswer);
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

                    <RadioGroup
                        name={question.name}
                        className={classes.sel}
                        onChange={(event, name) => this.handleChange(name)}
                        value={!isEmpty(question.answers) && find(question.answers).answer.option.name || ""}
                    >
                        {question && question.options.map(option => {

                            return question.selectionType === "SINGLE" ? (

                                <FormControlLabel
                                    key={option.graphId}
                                    className={classes.label}
                                    disabled={readOnly}
                                    value={option.name}
                                    label={option.name}
                                    control={<Radio className={classes.icon}/>}
                                />
                            ) : null;
                        })}
                    </RadioGroup>

                </FormControl>

            </div>
        );
    }
}

export default withStyles(styles)(RadioQuestion);
