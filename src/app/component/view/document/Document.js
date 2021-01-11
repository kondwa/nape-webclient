import React, { Component } from "react";
import { filter, find, indexOf, map } from "lodash";

import Button from "@material-ui/core/Button";
import DocumentStep from "./DocumentStep";
import GenerateIcon from "@material-ui/icons/PlayForWork";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import SaveIcon from "@material-ui/icons/Save";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import SlateEditor from "../../widget/richTextEditor/SlateEditor";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import StepContent from "@material-ui/core/StepContent";
import Stepper from "@material-ui/core/Stepper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import { injectIntl } from "react-intl";
import { withStyles } from "@material-ui/core/styles";

const inlineStyle = {
    button: {
        marginLeft: "30px"
    },
    clearDiv: {
        "clear": "right"
    }
};

const styles = theme => ({
    root: {
        width: "50%",
        justifyContent: "left",
        float: "left"
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    stepper: {
        margin: "30px",
        boxShadow: "0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)"
    },
    stepButton: {
        justifyContent: "left"
    },
    paper: {
        margin: "30px",
        padding: "50px"
    },
    actionsContainer: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        textAlign: "right"
    },
    resetContainer: {
        marginTop: 0,
        padding: theme.spacing.unit * 3,
    },
});

class Document extends Component {

    static propTypes = {
        document: PropTypes.object,
        placeholderList: PropTypes.array,
        loadDocument: PropTypes.func,
        saveDocument: PropTypes.func,
        loadDocumentPlaceholders: PropTypes.func,
        loadTemplateItemContent: PropTypes.func,
        templateItemContent: PropTypes.string,
        generateDocument: PropTypes.func,
        location: PropTypes.object,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleBack = :: this.handleBack;
        this.handleNext = :: this.handleNext;
        this.handleStep = :: this.handleStep;
        this.handleSave = :: this.handleSave;
        this.handleLoadPlaceholders = :: this.handleLoadPlaceholders;
        this.handleChangePlaceholderValue = :: this.handleChangePlaceholderValue;
        this.handleGenerate = :: this.handleGenerate;
        this.handleSelection = :: this.handleSelection;

        this.state = {
            activeStep: 0,
            completed: {},
            answers: props.document ? props.document.answers : null,
            placeholders: props.placeholderList,
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        let documentId = this.props.location.pathname.split("/")[4];
        const { loadDocument } = this.props;
        loadDocument(documentId);
    }

    UNSAFE_componentWillReceiveProps(newProps) {

        let groupKeys = map(newProps.document.template.groups, "key");
        let selectedKeys = map(newProps.document.answers, "groupKey");

        let completed = {};

        selectedKeys.forEach(function (key) {
            completed[indexOf(groupKeys, key)] = true;
        });

        this.setState({
            completed: completed,
            answers: newProps.document ? newProps.document.answers : null,
            placeholders: newProps.placeholderList
        });
    }

    handleNext() {
        const { completed } = this.state;
        completed[this.state.activeStep] = true;

        this.setState({
            completed,
            activeStep: this.state.activeStep + 1,
        });

        if (this.state.activeStep + 1 === this.props.document.template.groups.length) {
            this.handleLoadPlaceholders();
        }
    }

    handleStep(step) {
        const { completed } = this.state;
        completed[this.state.activeStep] = true;

        this.setState({
            completed,
            activeStep: step,
        });

        if (step === this.props.document.template.groups.length) {
            this.handleLoadPlaceholders();
        }
    }

    handleBack() {
        this.setState({
            activeStep: this.state.activeStep - 1,
        });
    }

    handleSave() {
        let documentId = this.props.location.pathname.split("/")[4];

        let { document, saveDocument } = this.props;

        if (this.state.placeholders) {
            document.placeholders = this.state.placeholders;
        }

        saveDocument(documentId, document);
    }

    handleGenerate() {
        let documentId = this.props.location.pathname.split("/")[4];

        const { document, generateDocument } = this.props;

        if (this.state.placeholders) {
            document.placeholders = this.state.placeholders;
        }

        generateDocument(documentId, document);
    }

    handleLoadPlaceholders() {
        let documentId = this.props.location.pathname.split("/")[4];
        const { loadDocumentPlaceholders } = this.props;
        loadDocumentPlaceholders(documentId);
    }

    handleChangePlaceholderValue(event) {

        let placeholders = this.state.placeholders.slice();

        let placeholder = find(placeholders, { name: event.target.id });
        placeholder.value = event.target.value;

        this.setState({ placeholders: placeholders });
    }

    handleSelection(newAnswer, checked) {
        let answers = this.state.answers;

        const itemId = newAnswer.optionKey ? newAnswer.optionKey : newAnswer.questionKey;

        this.props.loadTemplateItemContent(this.props.document.template.id, itemId);

        let answer = find(this.state.answers, { questionKey: newAnswer.questionKey, optionKey: newAnswer.optionKey });

        if (!answer) {
            answer = newAnswer;
            this.state.answers.push(answer);
        }

        answer.selected = checked;

        if (!checked && answer.optionKey === null) {

            let subAnswers = filter(this.state.answers, { questionKey: newAnswer.questionKey });
            subAnswers.map(function (subAnswer) {
                subAnswer.selected = checked;
                return subAnswer;
            });
        }

        this.setState({ answers: answers });
    }

    render() {
        const { document, templateItemContent, classes } = this.props;
        const { activeStep, placeholders } = this.state;

        return (
            <MLWrapper>

                {document ? (

                    <div style={{ marginTop: "30px" }}>

                        <SectionTitle
                            name={document.title}
                            enableBack={this.state.projectId !== ("LE" || "undefined") ? true : false}
                        >

                            <Button
                                color="primary"
                                variant="contained"
                                onClick={this.handleGenerate}
                                style={inlineStyle.button}
                            >
                                <GenerateIcon className={classes.leftIcon} />

                                {"Generate"}

                            </Button>

                            <Button
                                color="primary"
                                variant="contained"
                                onClick={this.handleSave}
                                style={inlineStyle.button}
                            >
                                <SaveIcon className={classes.leftIcon} />

                                {"Save"}

                            </Button>

                        </SectionTitle>

                        <div className={classes.root}>

                            {document.template ?
                                (
                                    <Stepper
                                        nonLinear
                                        className={classes.stepper}
                                        activeStep={activeStep}
                                        orientation="vertical"
                                    >

                                        {document.template.groups.map((group, index) =>
                                            (
                                                <Step key={group.title}>

                                                    <StepButton
                                                        onClick={() => this.handleStep(index)}
                                                        completed={this.state.completed[index]}
                                                        className={classes.stepButton}
                                                    >
                                                        {group.title}
                                                    </StepButton>

                                                    <StepContent>
                                                        <DocumentStep
                                                            groupKey={group.key}
                                                            questions={group.options}
                                                            answers={this.state.answers}
                                                            onSelect={this.handleSelection}
                                                        />

                                                        <div className={classes.actionsContainer}>
                                                            <div>

                                                                <Button
                                                                    disabled={activeStep === 0}
                                                                    onClick={this.handleBack}
                                                                    className={classes.button}
                                                                >
                                                                    {"Back"}
                                                                </Button>

                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={this.handleNext}
                                                                    className={classes.button}
                                                                >
                                                                    {"Next"}
                                                                </Button>

                                                            </div>
                                                        </div>

                                                    </StepContent>

                                                </Step>
                                            ))}


                                        <Step key={"plh"}>

                                            <StepButton
                                                onClick={() => this.handleStep(document.template.groups.length)}
                                                completed={this.state.completed[document.template.groups.length]}
                                                className={classes.stepButton}
                                            >
                                                {"Placeholders"}
                                            </StepButton>

                                            <StepContent>

                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>
                                                                {"Name"}
                                                            </TableCell>
                                                            <TableCell>
                                                                {"Value"}
                                                            </TableCell>
                                                        </TableRow>

                                                    </TableHead>


                                                    {placeholders ?
                                                        (
                                                            <TableBody>

                                                                {placeholders.map((placeholder) =>
                                                                    (
                                                                        <TableRow
                                                                            key={placeholder.name}
                                                                        >
                                                                            <TableCell>
                                                                                {placeholder.name}
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                <TextField
                                                                                    id={placeholder.name}
                                                                                    key={placeholder.name}
                                                                                    fullWidth
                                                                                    value={placeholder.value ? placeholder.value : ""}
                                                                                    className={classes.textField}
                                                                                    onChange={this.handleChangePlaceholderValue}
                                                                                />
                                                                            </TableCell>


                                                                        </TableRow>
                                                                    ))
                                                                }

                                                            </TableBody>

                                                        ) : null
                                                    }

                                                </Table>

                                                <div className={classes.actionsContainer}>

                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={this.handleGenerate}
                                                        className={classes.button}
                                                    >
                                                        {"Generate"}
                                                    </Button>
                                                </div>

                                            </StepContent>

                                        </Step>

                                    </Stepper>
                                ) : null}
                        </div>

                        <div className={classes.root}>
                            <Paper className={classes.paper}>
                                {templateItemContent ? (

                                    <SlateEditor
                                        htmlContent={templateItemContent}
                                    />

                                ) : "Currently no preview available"}
                            </Paper>
                        </div>

                        <div style={{ clear: "left" }} />

                    </div>

                ) : null}


            </MLWrapper>
        );
    }

}

export default injectIntl(withStyles(styles, { withTheme: true })(Document));
