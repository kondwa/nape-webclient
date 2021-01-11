import Button from "@material-ui/core/Button";
import {Component} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import find from "lodash/find";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    textField: {
        //width: "500px"
    }
});

const initialState = {
    title: "",
    titleErrorText: undefined,
    description: "",
    language: "",
    languageErrorText: undefined,
    type: "",
    typeErrorText: undefined,
    template: "",
    templateErrorText: undefined
};

const languages = [
    {key: "de_DE", name: "Deutsch"},
    {key: "en_GB", name: "English"}
];
const types = [
    {key: "PROPOSAL", name: "Proposal"},
    {key: "MONITORING_REPORT", name: "Monitoring Report"},
    {key: "EVALUATION_REPORT", name: "Evaluation Report"}
];

class DocumentDialog extends Component {

    static propTypes = {
        children: PropTypes.node,
        open: PropTypes.bool,
        projectId: PropTypes.string,
        loadTemplates: PropTypes.func,
        saveDocument: PropTypes.func,
        onClose: PropTypes.func,
        templates: PropTypes.array,
        classes: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleTitleInput = :: this.handleTitleInput;
        this.handleTitleBlur = :: this.handleTitleBlur;
        this.handleDescriptionInput = :: this.handleDescriptionInput;
        this.handleLanguageChange = :: this.handleLanguageChange;
        this.handleTypeChange = :: this.handleTypeChange;
        this.handleTemplateChange = :: this.handleTemplateChange;

        this.state = {
            ...initialState,
            open: this.props.open
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            open: newProps.open
        });
    }

    handleTitleInput(newValue) {
        this.setState({
            title: newValue.target.value,
            titleErrorText: undefined
        });
    }

    handleDescriptionInput(newValue) {
        this.setState({
            description: newValue.target.value
        });
    }

    handleTitleBlur(event) {
        let newValue = event.target.value;

        if (newValue === "" || newValue === undefined) {
            this.setState({
                titleErrorText: "Title must be defined.",
            });
        }
    }

    handleSave() {
        const {title, description, template} = this.state;

        let document = {
            projectId: this.props.projectId,
            title: title,
            description: description,
            template: find(this.props.templates, {id: template})
        };

        this.props.saveDocument(document);

        this.handleClose();

    }

    handleClose() {
        this.props.onClose();
    }

    handleTypeChange(event) {
        this.setState({
            type: event.target.value,
            typeErrorText: undefined,
            language: initialState.language,
            languageErrorText: initialState.languageErrorText,
            template: initialState.template,
            templateErrorText: initialState.templateErrorText
        });
    }

    handleLanguageChange(event) {
        this.setState({
            language: event.target.value,
            languageErrorText: undefined,
            template: initialState.template,
            templateErrorText: initialState.templateErrorText
        });

        this.props.loadTemplates(event.target.value, this.state.type);
    }

    handleTemplateChange(event) {
        this.setState({
            template: event.target.value,
            templateErrorText: undefined,
        });
    }

    render() {

        const {templates, children, classes} = this.props;

        return (
            <MLWrapper>
                {children}
                <Dialog open={this.state.open}>

                    <DialogTitle>{"Create New Report"}</DialogTitle>

                    <DialogContent>
                        <TextField
                            required
                            error={!!this.state.titleErrorText}
                            className={classes.textField}
                            label="Title"
                            value={this.state.title}
                            fullWidth
                            autoFocus
                            onChange={this.handleTitleInput}
                            onBlur={this.handleTitleBlur}
                            margin="normal"
                        />

                        <TextField
                            className={classes.textField}
                            label="Description"
                            value={this.state.description}
                            fullWidth
                            onChange={this.handleDescriptionInput}
                            margin="normal"
                        />

                        <TextField
                            select
                            fullWidth
                            required
                            label="Type"
                            className={classes.textField}
                            value={this.state.type}
                            onChange={this.handleTypeChange}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="Please select the report type"
                            margin="normal"
                        >
                            {types && types.map(type => (
                                <MenuItem
                                    key={type.name}
                                    value={type.key}
                                >
                                    {type.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select={!!this.state.type}
                            fullWidth
                            required
                            disabled={!this.state.type}
                            label="Language"
                            className={classes.textField}
                            value={this.state.language}
                            onChange={this.handleLanguageChange}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="Please select the report language"
                            margin="normal"
                        >
                            {languages && languages.map(language => (
                                <MenuItem
                                    key={language.name}
                                    value={language.key}
                                >
                                    {language.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select={!!this.state.language}
                            fullWidth
                            required
                            disabled={!this.state.language}
                            label="Template"
                            className={classes.textField}
                            value={this.state.template}
                            onChange={this.handleTemplateChange}
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            helperText="Please select the report template"
                            margin="normal"
                        >
                            {templates && templates.map(template => (
                                <MenuItem
                                    key={template.name}
                                    value={template.id}
                                >
                                    {template.title}
                                </MenuItem>
                            ))}
                        </TextField>

                    </DialogContent>

                    <DialogActions>
                        <Button
                            onClick={this.handleClose}
                        >
                            {"Cancel"}
                        </Button>
                        <Button
                            disabled={!this.state.title || !this.state.template}
                            onClick={this.handleSave}
                            color="primary"
                        >
                            {"Create"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MLWrapper>
        );
    }
}


export default injectIntl(withStyles(styles, {withTheme: true})(DocumentDialog));
