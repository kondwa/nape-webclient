import React, {Component} from "react";

import AddIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Build";
import EvaluationQuestionDialog from "./EvaluationQuestionDialog";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import UploadIcon from "@material-ui/icons/Publish";
import find from "lodash/find";
import {injectIntl} from "react-intl";
import uuid from "uuid";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        padding: theme.spacing.unit * 2
    },
    startContainer: {
        marginTop: "30px",
        textAlign: "center"
    },
    start: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    startButton: {
        marginLeft: "30px"
    },
    criteria: {
        marginBottom: "50px"
    },
    criteriaHeader: {
        display: "flex",
        alignItems: "center"
    },
    colCriteria: {
        width: "5%",
        padding: "5px"
    },
    colQuestion: {
        width: "20%",
        padding: "5px"
    },
    colResult: {
        width: "20%",
        padding: "5px"
    },
    colLevel: {
        width: "7%",
        padding: "5px"
    },
    colIndicators: {
        width: "15%",
        padding: "5px"
    },
    colComments: {
        width: "10%",
        padding: "5px"
    },
    colActions: {
        width: "10%",
        padding: "5px"
    },
    emptyTable: {
        margin: "20px"
    }
});

const oecdDacCriteria = ["Relevance", "Effectiveness", "Efficiency", "Impact", "Sustainability"];

class EvaluationMatrix extends Component {

    static propTypes = {
        model: PropTypes.object.isRequired,
        onChange: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleTerminologyChange = :: this.handleTerminologyChange;
        this.handleStart = :: this.handleStart;
        this.handleAddQuestion = :: this.handleAddQuestion;
        this.handleRemoveQuestion = :: this.handleRemoveQuestion;
        this.handleSelectResult = :: this.handleSelectResult;
        this.handleEditQuestion = :: this.handleEditQuestion;

        this.state = {
            terminology: "",
            dialogOpen: false,
            uploadDialogOpen: false,
            selectedQuestion: undefined,
            evaluation: props.model.evaluation
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            evaluation: newProps.model.evaluation,
            selectedQuestion: undefined,
            dialogOpen: false,
            uploadDialogOpen: false
        });
    }

    handleTerminologyChange(event) {
        this.setState({terminology: event.target.value});
    }

    handleStart() {

        let criteria = [];

        switch (this.state.terminology) {
            case "OECD_DAC":
                oecdDacCriteria.forEach(name => {
                    criteria.push({
                        key: uuid.v4(),
                        name
                    });
                });
                break;

            default:
                break;
        }

        const evaluation = {criteria};

        this.props.onChange(evaluation);
    }

    handleAddQuestion(question) {
        const {evaluation} = this.state;

        if (!evaluation.questions) {
            evaluation.questions = [];
        }

        const existingQuestin = find(evaluation.questions, {key: question.key});

        if (!existingQuestin) {
            evaluation.questions.push(question);
        }

        this.props.onChange(evaluation);
    }

    handleRemoveQuestion(index) {

        const {evaluation} = this.state;

        evaluation.questions.splice(index, 1);

        this.props.onChange(evaluation);
    }

    handleSelectResult(question, value) {

        const {evaluation} = this.state;

        question.result = find(this.props.model.results, {key: value});

        this.props.onChange(evaluation);
    }

    handleEditQuestion(question) {
        this.setState({dialogOpen: true, selectedQuestion: question});
    }

    render() {

        const {model, classes} = this.props;
        const {evaluation} = this.state;

        return (
            <div className={classes.root}>

                {!evaluation && (
                    <div className={classes.startContainer}>

                        <Typography variant="body2">{"Evaluation matrix not yet created."}</Typography>

                        <div className={classes.start}>
                            <TextField
                                select
                                className={classes.textField}
                                label="Terminology"
                                value={this.state.terminology}
                                helperText="Select the applied terminology for this evaluation"
                                onChange={this.handleTerminologyChange}
                                margin="normal"
                            >
                                <MenuItem value={"OECD_DAC"}>{"OECD DAC"}</MenuItem>
                            </TextField>

                            <Button
                                color="primary"
                                variant="contained"
                                className={classes.startButton}
                                disabled={!this.state.terminology}
                                onClick={this.handleStart}
                            >{"Start"}
                            </Button>
                        </div>
                    </div>
                )}

                {evaluation && (

                    <div>

                        <EvaluationQuestionDialog
                            open={this.state.dialogOpen}
                            question={this.state.selectedQuestion}
                            model={model}
                            onApply={this.handleAddQuestion}
                            onClose={() => this.setState({dialogOpen: false})}
                        />

                        <div className={classes.criteriaHeader}>
                            <Typography variant="subtitle1">{"Evaluation Questions"}</Typography>

                            <IconButton
                                color="primary"
                                aria-label="Add Question"
                                style={{marginLeft: "20px"}}
                                onClick={() => this.setState({dialogOpen: true, selectedQuestion: null})}
                            >
                                <AddIcon/>
                            </IconButton>

                            <IconButton
                                disabled
                                color="primary"
                                aria-label="Upload Questions"
                                onClick={() => this.setState({uploadDialogOpen: true})}
                            >
                                <UploadIcon/>
                            </IconButton>
                        </div>
                        <Table>

                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.colCriteria}>{"Criteria"}</TableCell>
                                    <TableCell className={classes.colQuestion}>{"Question"}</TableCell>
                                    <TableCell className={classes.colResult}>{"Result"}</TableCell>
                                    <TableCell className={classes.colLevel}>{"Level"}</TableCell>
                                    <TableCell className={classes.colIndicators}>{"Indicators"}</TableCell>
                                    <TableCell className={classes.colComments}>{"Comments"}</TableCell>
                                    <TableCell className={classes.colActions}/>
                                </TableRow>
                            </TableHead>

                            {evaluation.questions ? (

                                <TableBody>
                                    {evaluation.questions.map((question, index) => (
                                        <TableRow key={question.key}>

                                            <TableCell className={classes.colResult}>
                                                {question.criterion ? question.criterion : "-"}
                                            </TableCell>

                                            <TableCell className={classes.colQuestion}>
                                                {question.name}
                                            </TableCell>

                                            <TableCell className={classes.colResult}>
                                                {question.result ? question.result.label : "-"}
                                            </TableCell>

                                            <TableCell className={classes.colLevel}>
                                                {question.result ? find(model.levels, {key: question.result.level}).label : null}
                                            </TableCell>

                                            <TableCell className={classes.colIndicators}>

                                                {question.result ?
                                                    (
                                                        <div>

                                                            {question.result.indicators ?
                                                                (
                                                                    <ul>
                                                                        {question.result.indicators.map(indicator => (
                                                                            <li key={indicator.key}>
                                                                                {indicator.name}
                                                                            </li>
                                                                        ))}
                                                                    </ul>

                                                                ) : "No indicators defined."}

                                                        </div>

                                                    ) : null}

                                            </TableCell>

                                            <TableCell className={classes.colComments}>
                                                {question.comments}
                                            </TableCell>

                                            <TableCell
                                                className={classes.colActions}
                                                style={{paddingRight: 0}}
                                            >
                                                <IconButton
                                                    aria-label="Edit"
                                                    onClick={() => this.handleEditQuestion(question)}
                                                >
                                                    <EditIcon/>
                                                </IconButton>
                                                <IconButton
                                                    aria-label="Remove"
                                                    onClick={() => this.handleRemoveQuestion(index)}
                                                >
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>

                            ) : null}

                        </Table>

                        {!evaluation.questions || evaluation.questions.length === 0 ? (
                            <Typography
                                variant="body2"
                                className={classes.emptyTable}
                            >{"No questions defined."}</Typography>
                        ) : null}

                    </div>
                )}

            </div>
        );
    }
}


export default injectIntl(withStyles(styles, {withTheme: true})(EvaluationMatrix));
