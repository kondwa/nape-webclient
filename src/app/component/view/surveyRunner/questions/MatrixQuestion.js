import FormControlLabel from "@material-ui/core/FormControlLabel";
import PropTypes from "prop-types";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {createMatrixAnswer} from "../../../../common/utils/QuestionUtils";
import find from "lodash/find";
import isEmpty from "lodash/isEmpty";
import uuid from "uuid";

class MatrixQuestion extends React.Component {

    static propTypes = {
        question: PropTypes.object,
        readOnly: PropTypes.bool.isRequired,
        add: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    handleChange(name, row) {
        const {add, question} = this.props;

        let option = find(question.options, (o) => o.name === name);

        if (option) {
            if (question.answers.length > row.index && question.answers[row.index]) {
                let oldAnswer = question.answers[row.index];
                oldAnswer.answer.option = option;
                oldAnswer.answer.value = option.name;
                add(question, null);
            } else {
                let newAnswer = createMatrixAnswer(option, row.index, row.name);
                add(question, newAnswer);
            }
        }
    }

    render() {
        const {question, readOnly} = this.props;

        return (
            <div>

                {question.description ?
                    (<div style={{padding: "20px 5px"}}>
                        <span className="subtitle">{question.description}</span>
                    </div>) : null}
                <Table>
                    <TableHead>
                        <TableRow>
                            {question.rows.length > 0 && question.rows[0].description ?
                                <TableCell key={0}/> : null}

                            {question.options.map(option => {
                                return (
                                    <TableCell
                                        style={{paddingLeft: "5px", whiteSpace: "unset"}}
                                        key={uuid.v4()}
                                    >
                                        {option.description}
                                    </TableCell>);
                            })}

                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {question.rows.map(row => {
                            return (
                                <TableRow
                                    hover
                                    key={uuid.v4()}
                                >
                                    {question.options.map(option => {
                                        return (
                                            <TableCell
                                                key={uuid.v4()}
                                                padding="dense"
                                            >
                                                <RadioGroup
                                                    name={question.description}
                                                    onChange={(event, name) => this.handleChange(name, row)}
                                                    value={!isEmpty(question.answers) && find(question.answers).answer.option.name || ""}
                                                >
                                                    <FormControlLabel
                                                        disabled={readOnly}
                                                        value={option.name}
                                                        label={option.name}
                                                        control={<Radio/>}
                                                    />
                                                </RadioGroup>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>);
                        })}
                    </TableBody>
                </Table>

            </div>
        );
    }
}

export default MatrixQuestion;
