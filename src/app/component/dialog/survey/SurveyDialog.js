import {injectIntl, intlShape} from "react-intl";

import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import {Component} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ErrorText from "../../widget/errorHelper/ErrorText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import filter from "lodash/filter";
import find from "lodash/find";
import uuid from "uuid";

const initialState = {
    cancelDisabled: false,
    createDisabled: false,
    surveyNameValue: "",
    surveyNameErrorText: undefined,
    anonymous: false,
    type: 1,
    template: "",
    templates: [],
    templateSearchText: "",
    templateErrorText: undefined,
    templateVersion: "",
    templateVersionErrorText: undefined,
    templateVersionDataSource: [],
    organization: "",
    organizationErrorText: undefined,
    project: "",
    projectErrorText: undefined,
    projectDataSource: []
};

class SurveyDialog extends Component {

    static propTypes = {
        title: PropTypes.string,
        children: PropTypes.node,
        projectKey: PropTypes.string,
        loadSurveyDialogOpen: PropTypes.bool,
        closeDialog: PropTypes.func,
        intl: intlShape.isRequired,
        templates: PropTypes.array,
        loadSurveyDialog: PropTypes.func,
        createSurvey: PropTypes.func,
        templateDataSource: PropTypes.array,
        organizations: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleSurveyNameInput = :: this.handleSurveyNameInput;
        this.handleSurveyNameBlur = :: this.handleSurveyNameBlur;
        this.handleAnonymousInput = :: this.handleAnonymousInput;
        this.handleTypeChange = :: this.handleTypeChange;
        this.handleTemplateChange = :: this.handleTemplateChange;
        this.handleOrganizationChange = :: this.handleOrganizationChange;
        this.handleProjectChange = :: this.handleProjectChange;
        this.handleTemplateVersionChange = :: this.handleTemplateVersionChange;
        this.state = {
            ...initialState,
            project: props.projectKey ? props.projectKey : ""
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (!this.props.loadSurveyDialogOpen && nextProps.loadSurveyDialogOpen === true) {
            this.props.loadSurveyDialog();
        }

        if (nextProps.projectKey && nextProps.organizations) {
            for (let i = 0; i < nextProps.organizations.length; i++) {

                const organization = nextProps.organizations[i];
                const projects = organization.children;

                if (projects) {
                    const project = find(projects, {foreignId: nextProps.projectKey});

                    if (project) {
                        this.setState({
                            organization: organization.foreignId,
                            projectDataSource: organization.children,
                        });

                        break;
                    }
                }
            }
        }
    }

    handleSave() {

        if (this.state.createDisabled) {
            return;
        }

        let valid = true;

        if (!this.state.surveyNameValue) {
            valid = false;
            this.setState({
                surveyNameErrorText: this.props.intl.formatMessage({"id": "activation.form.survey.title.error.required"})
            });
        }

        if (!this.state.template) {
            valid = false;
            this.setState({
                templateErrorText: this.props.intl.formatMessage({"id": "activation.form.template.error.required"})
            });
        }

        if (!this.state.templateVersion) {
            valid = false;
            this.setState({
                templateVersionErrorText: this.props.intl.formatMessage({"id": "activation.form.templateversion.error.required"})
            });
        }

        if (!this.state.organization) {
            valid = false;
            this.setState({
                organizationErrorText: this.props.intl.formatMessage({"id": "activation.form.organization.error.required"})
            });
        }

        if (!this.state.project) {
            valid = false;
            this.setState({
                projectErrorText: this.props.intl.formatMessage({"id": "activation.form.project.error.required"})
            });
        }

        if (valid) {

            this.setState({
                cancelDisabled: true,
                createDisabled: true
            });

            const payload = {
                surveyName: this.state.surveyNameValue,
                templateIdentifier: this.state.template,
                templateVersion: this.state.templateVersion,
                type: this.state.type === 1 ? "AD_HOC" : "PREDEFINED",
                anonymous: this.state.anonymous,
                unitForeignId: this.state.project,
            };

            this.props.createSurvey(payload);
        }
    }

    handleClose() {

        if (this.state.cancelDisabled) {
            return;
        }

        this.props.closeDialog();
    }

    handleSurveyNameInput(newValue) {
        this.setState({
            surveyNameValue: newValue.target.value,
            surveyNameErrorText: undefined
        });
    }

    handleSurveyNameBlur(event) {
        let newValue = event.target.value;

        if (newValue === "" || newValue === undefined) {
            this.setState({
                surveyNameErrorText: this.props.intl.formatMessage({"id": "activation.form.survey.title.error.required"}),
            });
        }
    }

    handleAnonymousInput(isInputChecked) {
        this.setState({
            anonymous: isInputChecked.target.checked
        });
    }

    handleTypeChange(payload) {
        this.setState({
            type: payload.target.value,
            anonymous: payload.target.value === 1 ? this.state.payload : false
        });
    }

    handleTemplateChange(chosenRequest) {
        const {templates} = this.props;
        this.setState({
            template: chosenRequest.target.value,
            templateVersionDataSource: templates,
            templateVersionErrorText: undefined,
        });
    }

    handleTemplateVersionChange(payload) {
        this.setState({
            templateVersion: payload.target.value,
            templateVersionErrorText: undefined,
        });
    }

    handleProjectChange(chosenRequest) {
        this.setState({
            project: chosenRequest.target.value,
            projectErrorText: undefined
        });
    }

    handleOrganizationChange(payload) {

        let organization = this.props.organizations ? find(this.props.organizations, function (organization) {
            return organization.foreignId === payload.target.value;
        }) : [];

        this.setState({
            organization: organization.foreignId,
            organizationErrorText: undefined,
            project: "",
            projectErrorText: undefined,
            projectDataSource: organization.children
        });
    }

    render() {

        const {title, loadSurveyDialogOpen, children, intl} = this.props;

        if (!loadSurveyDialogOpen) {
            return (<div>{children}</div>);
        }

        const actions = [
            <Button
                key="cancel"
                color="primary"
                onClick={this.handleClose}
                disabled={this.state.cancelDisabled}
            >
                {intl.formatMessage({"id": "activation.form.button.cancel"})}
            </Button>,
            <Button
                key="create"
                color="primary"
                onClick={this.handleSave}
                disabled={this.state.createDisabled}
            >
                {intl.formatMessage({"id": "activation.form.button.create"})}
            </Button>
        ];

        return (
            <div>

                {children}

                <Dialog open={loadSurveyDialogOpen}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent style={{width: "600px"}}>

                        {/* Survey Name */}
                        <TextField
                            fullWidth
                            label={intl.formatMessage({"id": "activation.form.survey.title.floating-label"})}
                            onChange={this.handleSurveyNameInput}
                            value={this.state.surveyNameValue}
                            onBlur={this.handleSurveyNameBlur}
                            margin="normal"
                        />
                        <ErrorText text={this.state.surveyNameErrorText}/>

                        {/* Survey Template */}
                        <FormControl
                            margin="normal"
                            style={{display: "inline-block", position: "relative", width: "100%"}}
                        >
                            <InputLabel
                                htmlFor="age-simple"
                            >
                                {intl.formatMessage({"id": "activation.form.template.hint-text"})}
                            </InputLabel>
                            <Select
                                fullWidth
                                value={this.state.template}
                                onChange={(value) => {
                                    this.handleTemplateChange(value);
                                }}
                            >
                                {
                                    this.props.templateDataSource && this.props.templateDataSource.map(template => {
                                        return (
                                            <MenuItem
                                                key={uuid.v4()}
                                                value={template.valueKey}
                                            >
                                                {template.textKey}
                                            </MenuItem>);
                                    })
                                }
                            </Select>
                            <ErrorText text={this.state.templateErrorText}/>
                        </FormControl>


                        {/* Survey Template Version */}
                        {
                            this.state.templates ?
                                (
                                    <FormControl
                                        margin="normal"
                                        style={{display: "inline-block", position: "relative", width: "100%"}}
                                    >
                                        <InputLabel htmlFor="age-simple">{intl.formatMessage({"id": "activation.form.templateversion.hint-text"})}</InputLabel>
                                        <Select
                                            fullWidth
                                            value={this.state.templateVersion}
                                            onChange={(value) => {
                                                this.handleTemplateVersionChange(value);
                                            }}
                                        >
                                            {
                                                this.props.templates && filter(this.props.templates, {identifier: this.state.template}).map(template => {
                                                    return (
                                                        <MenuItem
                                                            key={uuid.v4()}
                                                            value={template.version}
                                                        >
                                                            {template.version}
                                                        </MenuItem>);
                                                })
                                            }
                                        </Select>
                                        <ErrorText text={this.state.templateVersionErrorText}/>
                                    </FormControl>) : null
                        }

                        {/* Survey Template Type */}
                        <FormControl
                            margin="normal"
                            style={{display: "inline-block", position: "relative", width: "100%"}}
                        >
                            <Select
                                fullWidth
                                value={this.state.type}
                                onChange={(value) => {
                                    this.handleTypeChange(value);
                                }}
                            >
                                <MenuItem
                                    key={uuid.v4()}
                                    value={1}
                                >
                                    {intl.formatMessage({"id": "activation.form.surveytype.ad-hoc"})}
                                </MenuItem>
                                <MenuItem
                                    key={uuid.v4()}
                                    value={2}
                                >
                                    {intl.formatMessage({"id": "activation.form.surveytype.predefined"})}
                                </MenuItem>
                            </Select>
                        </FormControl>

                        {
                            // Show only in case type == ad hoc
                            this.state.type === 1 ?
                                (
                                    <FormGroup key={uuid.v4()}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    value={intl.formatMessage({"id": "activation.form.anonymous.label"})}
                                                    checked={this.state.anonymous}
                                                    onChange={(isChecked) => {
                                                        this.handleAnonymousInput(isChecked);
                                                    }}
                                                />
                                            }
                                            label={intl.formatMessage({"id": "activation.form.anonymous.label"})}
                                        />
                                    </FormGroup>) : null
                        }

                        {/* Survey Organization */}
                        <FormControl
                            margin="normal"
                            disabled={!!this.props.projectKey}
                            style={{display: "inline-block", position: "relative", width: "100%"}}
                        >
                            <InputLabel
                                htmlFor="age-simple"
                            >
                                {intl.formatMessage({"id": "activation.form.organization.hint-text"})}
                            </InputLabel>

                            <Select
                                fullWidth
                                value={this.state.organization}
                                onChange={(value) => {
                                    this.handleOrganizationChange(value);
                                }}
                            >
                                {
                                    this.props.organizations && this.props.organizations.map(organization => {
                                        return (
                                            <MenuItem
                                                key={organization.foreignId}
                                                value={organization.foreignId}
                                            >
                                                {organization.name}
                                            </MenuItem>);
                                    })
                                }
                            </Select>
                            <ErrorText text={this.state.organizationErrorText}/>
                        </FormControl>

                        {/* Survey Project*/}
                        <FormControl
                            margin="normal"
                            disabled={!!this.props.projectKey}
                            style={{display: "inline-block", position: "relative", width: "100%"}}
                        >
                            <InputLabel
                                htmlFor="age-simple"
                            >
                                {intl.formatMessage({"id": "activation.form.project.hint-text"})}
                            </InputLabel>
                            <Select
                                fullWidth
                                value={this.state.project}
                                onChange={(value) => {
                                    this.handleProjectChange(value);
                                }}
                            >
                                {
                                    this.state.projectDataSource.map(project => {
                                        return (
                                            <MenuItem
                                                key={project.foreignId}
                                                value={project.foreignId}
                                            >
                                                {project.name}
                                            </MenuItem>);
                                    })
                                }
                            </Select>
                            <ErrorText text={this.state.projectErrorText}/>
                        </FormControl>
                    </DialogContent>

                    <DialogActions>
                        {actions}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default injectIntl(SurveyDialog);
