import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CheckBoxQuestion from "./questions/CheckBoxQuestion";
import CloseSurvey from "@material-ui/icons/ExitToApp";
import DateQuestion from "./questions/DateQuestion";
import DropdownQuestion from "./questions/DropdownQuestion";
import MLRaisedButton from "../../widget/button/MLRaisedButton";
import MatrixQuestion from "./questions/MatrixQuestion";
import Moment from "moment";
import NumberQuestion from "./questions/NumberQuestion";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import RadioQuestion from "./questions/RadioQuestion";
import React from "react";
import SaveSurvey from "@material-ui/icons/Done";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import Stepper from "@material-ui/core/Stepper";
import SubmitSurvey from "@material-ui/icons/DoneAll";
import TextQuestion from "./questions/TextQuestion";
import Typography from "@material-ui/core/Typography/Typography";
import Validators from "../../../validators/validators";
import sortBy from "lodash/sortBy";
import {withStyles} from "@material-ui/core/styles";


const styles = theme => ({
    root: {
        marginTop: 40
    },
    stepper: {
        backgroundColor: "rgba(255, 255, 255, 0.52)"
    },
    page: {
        marginTop: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 4
    },
    paper: {
        margin: "30px 30px 0 30px"
    },
    avatar: {
        backgroundColor: theme.palette.primary.main
    },
    question: {
        marginBottom: theme.spacing.unit * 6,
    },
    questionHeader: {
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing.unit * 2,
    },
    questionTitle: {
        marginLeft: theme.spacing.unit * 2,
    },
    topButton: {
        width: 180,
        marginLeft: theme.spacing.unit * 4,
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "space-around",
        paddingBottom: theme.spacing.unit * 2
    },
    button: {
        marginRight: theme.spacing.unit,
    },
});

class SurveyRunner extends React.Component {

    static propTypes = {
        addQuestionAnswer: PropTypes.func,
        removeQuestionAnswer: PropTypes.func,
        saveSurveyInstance: PropTypes.func,
        saveAndSubmitSurveyInstanceAnonymous: PropTypes.func,
        submitSurveyInstance: PropTypes.func,
        activateTriggers: PropTypes.func,
        history: PropTypes.object,
        match: PropTypes.object,
        surveyInstance: PropTypes.object,
        propertyChange: PropTypes.func,
        scrollTo: PropTypes.func,
        questions: PropTypes.array,
        loadSurveyInstanceAnonymous: PropTypes.func,
        classes: PropTypes.object,
    };

    constructor(props) {
        super(props);
        this.state = {
            activePage: 0
        };

        this.handleClose = ::this.handleClose;
        this.handlePrevPage = ::this.handlePrevPage;
        this.handleNextPage = ::this.handleNextPage;
    }

    UNSAFE_componentWillMount() {
        let surveyGid = this.props.match.params.token;
        if (surveyGid) {
            const {loadSurveyInstanceAnonymous} = this.props;
            loadSurveyInstanceAnonymous(surveyGid);
        }
    }

    componentDidMount() {
        //if (this.props.surveyInstance.status === "NEW") {
        //    this.handleOpenLandingPage();
        //}
    }

    handleClose() {
        const {history} = this.props;
        history.goBack();
    }

    handlePrevPage() {
        if (this.state.activePage > 0) {
            this.setState({activePage: this.state.activePage - 1});
        }

        this.props.scrollTo(0, 0);
    }

    handleNextPage() {

        this.setState({activePage: this.state.activePage + 1});

        this.props.scrollTo(0, 0);
    }

    render() {
        const {
            surveyInstance, questions, propertyChange, activateTriggers, saveAndSubmitSurveyInstanceAnonymous,
            addQuestionAnswer, removeQuestionAnswer, saveSurveyInstance, submitSurveyInstance, classes
        } = this.props;

        let amountMandatory = 0;
        let amountAnswered = 0;

        if (questions) {
            for (let i = 0; i < questions.length; i++) {
                let question = questions[i];
                if (question.visible) {
                    if (question.mandatory) {
                        amountMandatory++;
                        if (question.answers.length > 0) {
                            amountAnswered++;
                        }
                    }
                }
            }
        }

        const readOnly = surveyInstance && surveyInstance.status === "SENT";
        const allowSubmit = amountAnswered >= amountMandatory;
        const isAnonymous = surveyInstance && surveyInstance.surveyVisibilityType === "ANONYMOUS";

        const pages = surveyInstance.pages ? sortBy(surveyInstance.pages, ["index"]) : [];
        const page = pages.length > this.state.activePage ? pages[this.state.activePage] : undefined;

        const headings = [];

        let count = 0;
        let prevQuestions = 0;
        for (let p = 0; p < this.state.activePage; p++) {
            for (let q = 0; q < pages[p].questions.length; q++) {
                if (pages[p].questions[q].visible) {
                    prevQuestions++;
                }
            }
        }

        surveyInstance.lastEditTime ? headings.push("Last Edit: " + Moment(surveyInstance.lastEditTime).format("DD.MM.YYYY HH:mm:ss")) : "";
        surveyInstance.templateVersion ? headings.push("Version: " + surveyInstance.templateVersion) : "";


        return (
            <div className={classes.root}>

                <SectionTitle name={`${surveyInstance.surveyName}`}>

                    {!isAnonymous ?
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={readOnly}
                            className={classes.topButton}
                            onClick={saveSurveyInstance}
                        >
                            {"Save"}
                            <SaveSurvey/>
                        </Button>
                        : null
                    }

                    <MLRaisedButton
                        color="secondary"
                        variant="contained"
                        userRoles={["user_editor", "user"]}
                        disabled={!allowSubmit || readOnly}
                        className={classes.topButton}
                        onClick={isAnonymous ? saveAndSubmitSurveyInstanceAnonymous : submitSurveyInstance}
                    >
                        {"Save & Submit"}
                        <SubmitSurvey/>

                    </MLRaisedButton>

                    <Button
                        color="default"
                        variant="contained"
                        className={classes.topButton}
                        onClick={isAnonymous ? (e) => e : this.handleClose}
                        href={isAnonymous ? "http://www.mainlevel-consulting.de" : ""}
                    >
                        {"Close"}
                        <CloseSurvey/>
                    </Button>
                </SectionTitle>

                <Paper className={classes.paper}>

                    <Stepper
                        activeStep={this.state.activePage}
                        className={classes.stepper}
                        alternativeLabel
                        nonLinear
                    >
                        {pages.map((page, index) => {
                            return (
                                <Step key={page.graphId}>
                                    <StepButton
                                        onClick={() => this.setState({activePage: index})}
                                        active={this.state.activePage === index}
                                    >
                                        {page.name}
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>

                </Paper>

                <Paper className={classes.paper}>

                    <div className={classes.page}>

                        {page && page.questions && page.questions.map((question, index) => {

                            return question.visible || (readOnly && question.answers && question.answers.length > 0)? (

                                <div
                                    key={question.graphId}
                                    className={classes.question}
                                >

                                    <div className={classes.questionHeader}>

                                        <Avatar className={classes.avatar}>{prevQuestions + ++count}</Avatar>

                                        <Typography
                                            variant={"h6"}
                                            className={classes.questionTitle}
                                            color={"secondary"}
                                        >
                                            {question.title + (question.mandatory ? " *" : "")}
                                        </Typography>
                                    </div>

                                    {question.questionType === "TEXT" || question.questionType === "COMMENT" ?

                                        <TextQuestion
                                            id={index}
                                            add={addQuestionAnswer}
                                            question={question}
                                            readOnly={readOnly}
                                            validators={[Validators.lengthValidator]}
                                        /> : question.questionType === "RADIO" ?
                                            <RadioQuestion
                                                id={index}
                                                add={addQuestionAnswer}
                                                readOnly={readOnly}
                                                question={question}
                                                activateTriggers={activateTriggers}
                                            /> : question.questionType === "MATRIX_SINGLE_CHOICE" ?
                                                <MatrixQuestion
                                                    id={index}
                                                    question={question}
                                                    add={addQuestionAnswer}
                                                    readOnly={readOnly}
                                                /> : question.questionType === "DATE" ?
                                                    <DateQuestion
                                                        id={index}
                                                        question={question}
                                                        add={addQuestionAnswer}
                                                        readOnly={readOnly}
                                                    /> : question.questionType === "NUMBER" ?
                                                        <NumberQuestion
                                                            id={index}
                                                            add={addQuestionAnswer}
                                                            readOnly={readOnly}
                                                            question={question}
                                                            onChange={this.handleOnChange}
                                                            validators={[Validators.numericMinValidator]}
                                                        /> : question.questionType === "DROPDOWN" ?
                                                            <DropdownQuestion
                                                                id={index}
                                                                question={question}
                                                                add={addQuestionAnswer}
                                                                activateTriggers={activateTriggers}
                                                                readOnly={readOnly}
                                                            /> : question.questionType === "CHECKBOX" ?
                                                                <CheckBoxQuestion
                                                                    id={index}
                                                                    question={question}
                                                                    add={addQuestionAnswer}
                                                                    remove={removeQuestionAnswer}
                                                                    readOnly={readOnly}
                                                                    activateTriggers={activateTriggers}
                                                                    propertyChange={propertyChange}
                                                                /> : null}

                                </div>) : null;
                        })}

                    </div>

                    <div className={classes.buttonContainer}>
                        <Button
                            variant="contained"
                            disabled={this.state.activePage === 0}
                            onClick={this.handlePrevPage}
                            className={classes.button}
                        >
                            {"Back"}
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            disabled={this.state.activePage === pages.length - 1 && readOnly}
                            onClick={() => this.state.activePage === pages.length - 1 ? saveSurveyInstance() : this.handleNextPage()}
                            className={classes.button}
                        >
                            {this.state.activePage === pages.length - 1 ? "Save" : "Next"}
                        </Button>
                    </div>

                </Paper>

            </div>
        );
    }
}

export default withStyles(styles)(SurveyRunner);
