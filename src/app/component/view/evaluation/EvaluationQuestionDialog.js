import React, {Component} from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import filter from "lodash/filter";
import find from "lodash/find";
import includes from "lodash/includes";
import {injectIntl} from "react-intl";
import uuid from "uuid";

class EvaluationQuestionDialog extends Component {

    static propTypes = {
        open: PropTypes.bool,
        model: PropTypes.object,
        question: PropTypes.object,
        onClose: PropTypes.func,
        onApply: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleNameInput = :: this.handleNameInput;
        this.handleNameBlur = :: this.handleNameBlur;
        this.handleSelectCriterion = ::this.handleSelectCriterion;
        this.handleSelectResult = :: this.handleSelectResult;
        this.handleCommentsInput = :: this.handleCommentsInput;

        this.state = {
            name: props.question && props.question.name ? props.question.name : "",
            nameErrorText: undefined,
            comments: props.question && props.question.comments ? props.question.comments : "",
            criterion: props.question && props.question.criterion ? props.question.criterion : "SUSTAINABILITY",
            result: props.question && props.question.result ? props.question.result : null,
            results: props.model.results
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            name: newProps.question && newProps.question.name ? newProps.question.name : "",
            nameErrorText: undefined,
            comments: newProps.question && newProps.question.comments ? newProps.question.comments : "",
            criterion: newProps.question && newProps.question.criterion ? newProps.question.criterion : "SUSTAINABILITY",
            result: newProps.question && newProps.question.result ? newProps.question.result : null,
            results: newProps.model.results
        });
    }

    handleNameInput(event) {
        this.setState({
            name: event.target.value,
            nameErrorText: undefined
        });
    }

    handleNameBlur(event) {
        let newValue = event.target.value;

        if (newValue === "" || newValue === undefined) {
            this.setState({
                nameErrorText: "Question must be defined.",
            });
        }
    }

    handleSelectCriterion(event) {

        const {model} = this.props;

        const criterion = event.target.value;

        const levels = filter(model.levels, level => {
            return includes(level.criteria, criterion);
        });

        const filteredResults = filter(model.results, result => {
            return !!find(levels, {key: result.level});
        });

        const result = this.state.result ? find(filteredResults, {key: this.state.result.key}) : null;

        this.setState({
            criterion,
            result,
            results: filteredResults
        });
    }

    handleSelectResult(event) {
        const result = find(this.state.results, {key: event.target.value});
        this.setState({result});
    }

    handleCommentsInput(event) {
        this.setState({
            comments: event.target.value
        });
    }


    handleClose() {
        this.props.onClose();
    }

    handleSave() {
        const {question, onApply} = this.props;

        const newQuestion = question ? question : {key: uuid.v4()};
        newQuestion.name = this.state.name;
        newQuestion.criterion = this.state.criterion;
        newQuestion.result = this.state.result;
        newQuestion.comments = this.state.comments;

        onApply(newQuestion);

        this.handleClose();
    }

    render() {
        const {result, results} = this.state;

        return (
            <MLWrapper>

                <Dialog open={this.props.open}>

                    <DialogTitle>{"Edit Result Level"}</DialogTitle>

                    <DialogContent>
                        <TextField
                            required
                            label="Evaluation Question"
                            error={!!this.state.nameErrorText}
                            value={this.state.name}
                            fullWidth
                            multiline
                            rows={1}
                            rowsMax={3}
                            autoFocus
                            onChange={this.handleNameInput}
                            onBlur={this.handleNameBlur}
                            margin="normal"
                        />

                        <TextField
                            label="OECD DAC Criterion"
                            select
                            required
                            fullWidth
                            value={this.state.criterion ? this.state.criterion : ""}
                            onChange={this.handleSelectCriterion}
                            margin="normal"
                        >
                            <MenuItem value="RELEVANCE">{"Relevance"}</MenuItem>
                            <MenuItem value="EFFECTIVENESS">{"Effectiveness"}</MenuItem>
                            <MenuItem value="EFFICIENCY">{"Efficiency"}</MenuItem>
                            <MenuItem value="IMPACT">{"Impact"}</MenuItem>
                            <MenuItem value="SUSTAINABILITY">{"Sustainability"}</MenuItem>
                        </TextField>

                        <TextField
                            select
                            fullWidth
                            label="Result"
                            helperText="Select your particular result."
                            value={result ? result.key : ""}
                            onChange={this.handleSelectResult}
                            margin="normal"
                        >
                            {results.map(result => (
                                <MenuItem
                                    key={result.key}
                                    value={result.key}
                                >{result.label}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Comments"
                            value={this.state.comments}
                            fullWidth
                            multiline
                            rows={2}
                            rowsMax={5}
                            onChange={this.handleCommentsInput}
                            margin="normal"
                        />

                    </DialogContent>

                    <DialogActions>
                        <Button
                            key="cancel"
                            onClick={this.handleClose}
                        >
                            {"Cancel"}
                        </Button>
                        <Button
                            color="primary"
                            key="confirm"
                            disabled={!this.state.name}
                            onClick={this.handleSave}
                        >
                            {"Add"}
                        </Button>
                    </DialogActions>

                </Dialog>

            </MLWrapper>

        );
    }

}

export default injectIntl(EvaluationQuestionDialog);
