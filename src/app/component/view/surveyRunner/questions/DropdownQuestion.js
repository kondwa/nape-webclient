import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Select from "@material-ui/core/Select";
import {createSelectionAnswer} from "../../../../common/utils/QuestionUtils";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import uuid from "uuid";

class DropdownQuestion extends React.Component {

    static propTypes = {
        question: PropTypes.object,
        add: PropTypes.func,
        readOnly: PropTypes.bool.isRequired,
        activateTriggers: PropTypes.func
    };

    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    handleChange(name) {
        const {add, activateTriggers, question} = this.props;

        let option = find(question.options, (o) => o.name === name.target.value);

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
        const {question, readOnly} = this.props;

        return (
            <div>

                <FormControl style={{display: "flex", flexWrap: "wrap"}}>
                    <InputLabel htmlFor="age-simple">{"Chose something"}</InputLabel>
                    <Select
                        autoWidth
                        disabled={readOnly}
                        value={!isEmpty(question.answers) && find(question.answers).answer.option.name || ""}
                        onChange={(value) => {
                            this.handleChange(value);
                        }}
                        input={<Input id="age-simple"/>}
                    >
                        <MenuItem value=" ">
                            <em>{"None"}</em>
                        </MenuItem>
                        {question && question.options.map(option => {
                            return (
                                <MenuItem
                                    key={uuid.v4()}
                                    value={option.name}
                                >
                                    {option.name}
                                </MenuItem>);
                        })}
                    </Select>
                </FormControl>

            </div>
        );
    }
}

export default DropdownQuestion;
