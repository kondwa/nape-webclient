import { injectIntl, intlShape } from "react-intl";

import AnonymousIcon from "@material-ui/icons/Public";
import ArchiveIcon from "@material-ui/icons/Archive";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { Component } from "react";
import ConfirmationDialog from "../../../container/ConfirmationDialog";
import DownloadIcon from "@material-ui/icons/GetApp";
import FilterIcon from "@material-ui/icons/FilterList";
import GoToRunnerIcon from "@material-ui/icons/Create";
import IconButton from "@material-ui/core/IconButton";
import MLMenuWrapper from "../../widget/menuItem/MLMenuWrapper";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Moment from "moment";
import NewAdhocIcon from "@material-ui/icons/AddBox";
import NewPersonalizedIcon from "@material-ui/icons/PersonAdd";
import PropTypes from "prop-types";
import ReOpenIcon from "@material-ui/icons/Drafts";
import React from "react";
import RefreshIcon from "@material-ui/icons/Refresh";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import StatusIcon from "../../widget/statusIcon/StatusIcon";
import SurveyInvitationDialog from "../../../container/SurveyInvitationDialogContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";
import uuid from "uuid";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

const greenA200 = green.A200;
const grey500 = grey["500"];

const inlineStyle = {
    exportButton: {
        float: "right",
        marginLeft: "30px"
    },
    button: {
        float: "right",
        marginLeft: "30px",
    },
    clearDiv: {
        clear: "right"
    },
    card: {
        margin: "30px 30px 0 30px",
        overflowX: "auto"
    },
    cardActions: {
        zIndex: 2,
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "wrap"
    },
    cardMedia: {
        margin: "10px"
    }
};

const styles = theme => ({
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    hoverIcon: {
        "&:hover": {
            color: greenA200
        }
    }
});

const initialState = {
    confirmationDialogOpen: false,
    page: 0,
    rowsPerPage: 10
};

class SurveyInstanceList extends Component {

    static propTypes = {
        surveyInstanceList: PropTypes.array,
        loadSurveyInstanceListFilter: PropTypes.func,
        loadSurvey: PropTypes.func,
        location: PropTypes.object,
        loadSurveyInstance: PropTypes.func,
        createSurveyInstance: PropTypes.func,
        archiveSurveyInstance: PropTypes.func,
        changeSurveyInstanceStatus: PropTypes.func,
        invitationDialogOpen: PropTypes.bool,
        openInvitationDialog: PropTypes.func,
        closeInvitationDialog: PropTypes.func,
        handleExport: PropTypes.func,
        survey: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleCreateNewInstance = :: this.handleCreateNewInstance;
        this.handleOpenInvitationDialog = :: this.handleOpenInvitationDialog;
        this.handleExportToCSV = :: this.handleExportToCSV;
        this.handleOpenLinkDialog = :: this.handleOpenLinkDialog;
        this.handleChangePage = :: this.handleChangePage;
        this.handleChangeRowsPerPage = :: this.handleChangeRowsPerPage;
        this.state = {
            ...initialState,
            projectId: props.location.pathname.split("/")[2],
            surveyGid: props.location.pathname.split("/")[5]
        };
    }

    componentDidMount() {
        const { loadSurveyInstanceListFilter, loadSurvey } = this.props;
        loadSurvey(this.state.surveyGid);
        loadSurveyInstanceListFilter(this.state.surveyGid);
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState(initialState);
    }

    handleCreateNewInstance() {
        const { createSurveyInstance } = this.props;

        const payload = {};

        createSurveyInstance(this.state.surveyGid, payload);
    }

    handleOpenInvitationDialog() {
        const { openInvitationDialog } = this.props;
        openInvitationDialog();
    }

    handleOpenLinkDialog() {
        this.setState({
            ...this.state,
            confirmationDialogOpen: true
        });
    }

    handleExportToCSV() {
        const { handleExport } = this.props;
        handleExport(this.state.surveyGid);
    }

    handleArchive(instanceGid) {
        const { archiveSurveyInstance } = this.props;
        archiveSurveyInstance(this.state.surveyGid, instanceGid);
    }

    handleReOpen(instanceGid) {
        const { changeSurveyInstanceStatus } = this.props;
        changeSurveyInstanceStatus(this.state.surveyGid, instanceGid, "IN_PROGRESS");
    }

    handleLoadInstance(instanceGid) {
        const { loadSurveyInstance } = this.props;
        loadSurveyInstance(this.state.surveyGid, instanceGid);
    }

    handleChangePage(event, page) {
        this.setState({ page });
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value });
    }

    render() {
        const { survey, surveyInstanceList, invitationDialogOpen, closeInvitationDialog, classes } = this.props;

        const { surveyGid } = this.state;

        const surveyName = survey ? survey.surveyName : "...";
        const surveyLink = survey ? survey.link : "...";
        const isAdHoc = survey ? survey.type === "AD_HOC" : false;
        const isAnonymous = survey ? survey.visibility === "ANONYMOUS" : false;

        return (
            <MLWrapper>

                <div style={{ marginTop: "30px" }}>

                    <SectionTitle
                        name={surveyName}
                        enableBack={this.state.projectId !== ("undefined") ? true : false}
                    >

                        <Button
                            color="primary"
                            variant="contained"
                            style={inlineStyle.exportButton}
                            onClick={this.handleExportToCSV}
                        >
                            <DownloadIcon className={classes.leftIcon} />
                            {this.props.intl.formatMessage({ "id": "surveyinstancelist.button.downloadcsv" })}
                        </Button>

                        {isAdHoc ?
                            (
                                <Button
                                    color="primary"
                                    variant="contained"
                                    style={inlineStyle.button}
                                    onClick={this.handleCreateNewInstance}
                                >
                                    <NewAdhocIcon className={classes.leftIcon} />
                                    {this.props.intl.formatMessage({ "id": "surveyinstancelist.button.newinstance" })}
                                </Button>) :
                            (
                                <SurveyInvitationDialog
                                    title={this.props.intl.formatMessage({ "id": "invitation.form.title" })}
                                    open={invitationDialogOpen}
                                    surveyGid={surveyGid}
                                    closeDialog={closeInvitationDialog}
                                >
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={inlineStyle.button}
                                        onClick={this.handleOpenInvitationDialog}
                                    >
                                        <NewPersonalizedIcon className={classes.leftIcon} />
                                        {this.props.intl.formatMessage({ "id": "surveyinstancelist.button.newuser" })}
                                    </Button>
                                </SurveyInvitationDialog>)
                        }

                        {isAnonymous ?
                            (
                                <ConfirmationDialog
                                    title={this.props.intl.formatMessage({ "id": "surveyinstancelist.confirmation.form.title" })}
                                    message={surveyLink}
                                    open={this.state.confirmationDialogOpen}
                                >
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        style={inlineStyle.button}
                                        onClick={this.handleOpenLinkDialog}
                                    >
                                        <AnonymousIcon className={classes.leftIcon} />
                                        {this.props.intl.formatMessage({ "id": "surveyinstancelist.button.showlink" })}
                                    </Button>

                                </ConfirmationDialog>) : null
                        }

                    </SectionTitle>

                    <Card style={inlineStyle.card}>

                        <CardActions style={inlineStyle.cardActions}>
                            <Button color="primary">
                                <FilterIcon />
                                {"Filter"}
                            </Button>
                            <Button color="primary">
                                <RefreshIcon />
                                {"Refresh"}
                            </Button>
                        </CardActions>

                        <CardContent style={inlineStyle.cardMedia}>
                            <div className="pisa--grid">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "surveyinstancelist.table.header.author" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "surveyinstancelist.table.header.owner" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "surveyinstancelist.table.header.creation" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "surveyinstancelist.table.header.submit" })}
                                            </TableCell>
                                            <TableCell style={{ width: "50px" }}>
                                                {this.props.intl.formatMessage({ "id": "surveyinstancelist.table.header.answered" })}
                                            </TableCell>
                                            <TableCell style={{ width: "30px" }}>
                                                {this.props.intl.formatMessage({ "id": "surveyinstancelist.table.header.status" })}
                                            </TableCell>
                                            <TableCell style={{ width: "135px" }}>
                                                {this.props.intl.formatMessage({"id": "surveyinstancelist.table.header.actions"})}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {surveyInstanceList && (

                                        <TableBody>
                                            {surveyInstanceList
                                                .slice(this.state.page * this.state.rowsPerPage,
                                                    this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row =>
                                                    (
                                                        <TableRow
                                                            hover
                                                            key={uuid.v4()}
                                                        >

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.author ? row.author : "-"}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.owner ? row.owner : row.lastEditUser ? row.lastEditUser : "-"}
                                                            </TableCell>


                                                            <TableCell style={{ whiteSpace: "normal", padding: "10px" }}>
                                                                {row.creationTime ? Moment(row.creationTime).format("DD.MM.YYYY HH:mm:ss").toString() : "-"}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal", padding: "10px" }}>
                                                                {row.lastEditTime ? Moment(row.lastEditTime).format("DD.MM.YYYY HH:mm:ss").toString() : "-"}
                                                            </TableCell>

                                                            <TableCell style={{ width: "50px" }}>
                                                                {row.questionsAnswered}
                                                            </TableCell>

                                                            <TableCell
                                                                style={{ overflow: "visible", width: "30px" }}
                                                                title={row.status}
                                                            >
                                                                <StatusIcon status={row.status} />
                                                            </TableCell>

                                                            <TableCell style={{ overflow: "visible", width: "135px", padding: "0" }}>
                                                                
                                                                <IconButton
                                                                    style={{ width: 45 }}
                                                                    title="Open Runner"
                                                                    onClick={() => this.handleLoadInstance(row.instanceId)}
                                                                >
                                                                    <GoToRunnerIcon
                                                                        nativeColor={grey500}
                                                                        className={classes.hoverIcon}
                                                                    />
                                                                </IconButton>

                                                                <MLMenuWrapper
                                                                    userRoles={["admin","survey_viewer"]}
                                                                >
                                                                    <IconButton
                                                                        style={{ width: 45 }}
                                                                        title="Archive"
                                                                        onClick={() => this.handleArchive(row.instanceId)}
                                                                    >
                                                                        <ArchiveIcon
                                                                            nativeColor={grey500}
                                                                            className={classes.hoverIcon}
                                                                        />
                                                                    </IconButton>
                                                                </MLMenuWrapper>
                                                                { row.status && row.status === "SENT" ?
                                                                    <MLMenuWrapper
                                                                        userRoles={["admin","survey_list_editor"]}
                                                                    >
                                                                        <IconButton
                                                                            style={{ width: 45 }}
                                                                            title="Re-open"
                                                                            onClick={() => this.handleReOpen(row.instanceId)}
                                                                        >
                                                                            <ReOpenIcon
                                                                                nativeColor={grey500}
                                                                                className={classes.hoverIcon}
                                                                            />
                                                                        </IconButton>
                                                                    </MLMenuWrapper>
                                                                    : null}
                                                                
                                                            </TableCell>

                                                        </TableRow>
                                                    )
                                                )}
                                        </TableBody>
                                    )}

                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                count={surveyInstanceList ? surveyInstanceList.length : 0}
                                                rowsPerPage={this.state.rowsPerPage}
                                                page={this.state.page}
                                                onChangePage={this.handleChangePage}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </MLWrapper>
        );
    }
}

export default injectIntl(withRouter(withStyles(styles, { withTheme: true })(SurveyInstanceList)));
