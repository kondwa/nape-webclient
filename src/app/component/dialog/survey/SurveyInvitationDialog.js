import { injectIntl, intlShape } from "react-intl";

import ArrowLeft from "@material-ui/icons/ArrowBack";
import ArrowRight from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { Component } from "react";
import { DatePicker } from "material-ui-pickers";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import ErrorText from "../../widget/errorHelper/ErrorText";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import moment from "moment";

const initialState = {
    cancelDisabled: false,
    createDisabled: false,
    nameValue: "",
    nameErrorText: undefined,
    mailValue: "",
    mailErrorText: undefined,
    dateValue: moment(),
    dateErrorText: undefined,
    invitationTextValue: "",
    sendInvitation: false
};

const style = {
    textField: {
        width: "500px"
    }
};

class SurveyInvitationDialog extends Component {

    static propTypes = {
        title: PropTypes.string,
        children: PropTypes.node,
        open: PropTypes.bool,
        surveyGid: PropTypes.string,
        closeDialog: PropTypes.func,
        createSurveyInstanceParticipant: PropTypes.func.isRequired,
        intl: intlShape.isRequired
    };

    constructor( props ) {
        super(props);
        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleNameInput = :: this.handleNameInput;
        this.handleMailInput = :: this.handleMailInput;
        this.handleDateInput = :: this.handleDateInput;
        this.handleInvitationTextInput = :: this.handleInvitationTextInput;
        this.handleToggleSendInvitation = :: this.handleToggleSendInvitation;
        this.handleNameBlur = :: this.handleNameBlur;
        this.handleMailBlur = :: this.handleMailBlur;
        this.state = initialState;
    }

    handleSave() {

        if ( this.state.createDisabled ) {
            return;
        }

        let valid = true;

        if ( !this.state.nameValue ) {
            valid = false;
            this.setState({
                nameErrorText: this.props.intl.formatMessage({ "id": "invitation.form.name.error.required" })
            });
        }

        if ( !this.state.mailValue ) {
            valid = false;
            this.setState({
                mailErrorText: this.props.intl.formatMessage({ "id": "invitation.form.mail.error.required" })
            });
        }

        if ( valid ) {

            const payload = {
                username: this.state.mailValue,
                name: this.state.nameValue,
                expiryDate: this.state.dateValue,
                invitationText: this.state.invitationTextValue,
                sendInvitation: this.state.sendInvitation
            };

            const { surveyGid } = this.props;

            this.props.createSurveyInstanceParticipant(surveyGid, payload);
            this.setState(initialState);
        }
    }

    handleClose() {
        if ( this.state.cancelDisabled ) {
            return;
        }
        this.props.closeDialog();
        this.setState(initialState);
    }

    handleNameInput( event, newValue ) {
        this.setState({
            nameValue: newValue,
            nameErrorText: undefined
        });
    }

    handleMailInput( event, newValue ) {
        this.setState({
            mailValue: newValue,
            mailErrorText: undefined
        });
    }

    handleDateInput( event, newValue ) {
        this.setState({
            dateValue: newValue,
            dateErrorText: undefined
        });
    }

    handleInvitationTextInput( event, newValue ) {
        this.setState({
            invitationTextValue: newValue
        });
    }

    handleToggleSendInvitation( event, isInputChecked ) {
        this.setState({
            sendInvitation: isInputChecked
        });
    }

    handleNameBlur( event ) {
        let newValue = event.currentTarget.value;

        if ( newValue === "" || newValue === undefined ) {
            this.setState({
                nameErrorText: this.props.intl.formatMessage({ "id": "invitation.form.name.error.required" }),
            });
        }
    }

    handleMailBlur( event ) {
        let newValue = event.currentTarget.value;

        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if ( newValue === "" || newValue === undefined ) {
            this.setState({
                mailErrorText: this.props.intl.formatMessage({ "id": "invitation.form.mail.error.required" }),
            });
        } else if ( !regex.test(newValue) ) {
            this.setState({
                mailErrorText: this.props.intl.formatMessage({ "id": "invitation.form.mail.error.invalid" }),
            });
        }

    }

    render() {

        const { title, open, children, intl } = this.props;

        if ( !open ) {
            return (<div>{children}</div>);
        }

        const actions = [
            <Button
                fab
                key="cancel"
                primary
                onClick={this.handleClose}
                disabled={this.state.cancelDisabled}
            >
                {intl.formatMessage({ "id": "invitation.form.button.cancel" })}
            </Button>,
            <Button
                fab
                key="create"
                primary
                onClick={this.handleSave}
                disabled={this.state.createDisabled}
            >
                {intl.formatMessage({ "id": "invitation.form.button.create" })}
            </Button>
        ];

        return (
            <div>

                {children}

                <Dialog open={open}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label={intl.formatMessage({ "id": "invitation.form.survey.name.floating-label" })}
                            onChange={this.handleNameInput}
                            value={this.state.nameValue}
                            onBlur={this.handleNameBlur}
                            style={style.textField}
                        />
                        <ErrorText text={this.state.nameErrorText}/>

                        <TextField
                            style={style.textField}
                            label={intl.formatMessage({ "id": "invitation.form.survey.mail.floating-label" })}
                            onChange={this.handleMailInput}
                            value={this.state.mailValue}
                            onBlur={this.handleMailBlur}
                        />
                        <ErrorText text={this.state.mailValue}/>

                        <DatePicker
                            leftArrowIcon={<ArrowLeft/>}
                            rightArrowIcon={<ArrowRight/>}
                            id={"datePicker"}
                            autoOk
                            value={this.state.dateValue}
                            onChange={( date ) => {
                                this.handleChange(moment(date).format("DD.MM.YYYY"));
                            }}
                            style={style.textField}

                        />

                        <Checkbox
                            style={{ marginTop: "30px" }}
                            value={intl.formatMessage({ "id": "invitation.form.sendinvitation.label" })}
                            checked={this.state.sendInvitation}
                            onChange={this.handleToggleSendInvitation}
                        />

                        {this.state.sendInvitation ?
                            <TextField
                                style={style.textField}
                                label={intl.formatMessage({ "id": "invitation.form.survey.text.floating-label" })}
                                onChange={this.handleInvitationTextInput}
                                value={this.state.invitationTextValue}
                                multiLine
                                disabled={!this.state.sendInvitation}
                                rows={5}
                                rowsMax={10}
                            /> : null
                        }
                    </DialogContent>
                    <DialogActions>
                        {actions}
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default injectIntl(SurveyInvitationDialog);
