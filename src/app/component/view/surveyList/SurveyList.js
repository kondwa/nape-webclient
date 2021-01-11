import * as ROUTES from "../../../common/routes";

import React, { PureComponent } from "react";
import { injectIntl, intlShape } from "react-intl";

import AdhocIcon from "@material-ui/icons/Whatshot";
import AnonymousIcon from "@material-ui/icons/Public";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FilterIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import InstanceIcon from "@material-ui/icons/Assignment";
import LabeledProgress from "../../widget/progress/LabeledProgress";
import { Link } from "react-router-dom";
import MLMenuWrapper from "../../widget/menuItem/MLMenuWrapper";
import PersonalizedIcon from "@material-ui/icons/Person";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import StartIcon from "@material-ui/icons/PlayCircleOutline";
import SurveyDialog from "../../../container/SurveyDialog";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";
import { withStyles } from "@material-ui/core/styles";

const greenA200 = green.A200;
const grey500 = grey["500"];

const inlineStyle = {
    button: {
        marginLeft: "30px"
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

class SurveyList extends PureComponent {

    static propTypes = {
        surveyList: PropTypes.array,
        loadSurveyListFilter: PropTypes.func,
        surveyDialogOpen: PropTypes.bool,
        openSurveyDialog: PropTypes.func,
        closeSurveyDialog: PropTypes.func,
        location: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleOpenDialog = :: this.handleOpenDialog;
        this.handleChangePage = :: this.handleChangePage;
        this.handleChangeRowsPerPage = :: this.handleChangeRowsPerPage;
        this.state = {
            page: 0,
            rowsPerPage: 10,
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        const { loadSurveyListFilter } = this.props;
        loadSurveyListFilter(this.state.projectKey);
    }

    handleOpenDialog() {
        const { openSurveyDialog } = this.props;
        openSurveyDialog();
    }

    handleChangePage(event, page) {
        this.setState({ page });
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value });
    }

    render() {

        const { surveyDialogOpen, surveyList, closeSurveyDialog, classes } = this.props;

        return (
            <div style={{ marginTop: "30px" }}>
                <SectionTitle
                    name={this.props.intl.formatMessage({ "id": "surveylist.title" })}
                    enableBack={this.state.projectId !== ("LE" ||"undefined") ? true : false}
                    style={{ marginLeft: "30px" }}
                >
                    <MLMenuWrapper
                        userRoles={["survey_admin"]}
                    >
                        <SurveyDialog
                            title={this.props.intl.formatMessage({ "id": "activation.title" })}
                            open={surveyDialogOpen}
                            projectKey={this.state.projectKey}
                            closeDialog={closeSurveyDialog}
                        >
                            <Button
                                color="primary"
                                className={classes.button}
                                variant="contained"
                                style={inlineStyle.button}
                                onClick={this.handleOpenDialog}
                            >
                                <StartIcon
                                    className={classes.leftIcon}
                                />

                                {this.props.intl.formatMessage({ "id": "activation.entrance.label" })}

                            </Button>

                        </SurveyDialog>
                    </MLMenuWrapper>
                </SectionTitle>


                <Card style={inlineStyle.card}>
                    <CardActions style={inlineStyle.cardActions}>
                        <Button color="primary">
                            {"Filter"}
                            <FilterIcon />
                        </Button>
                        <Button color="primary">
                            {"Refresh"}
                            <RefreshIcon />
                        </Button>
                    </CardActions>

                    <CardContent style={inlineStyle.cardMedia}>
                        <div className="pisa--grid">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell tooltip="Report Name">
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.name" })}
                                        </TableCell>

                                        <TableCell tooltip="Template">
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.template" })}
                                        </TableCell>

                                        <TableCell tooltip="Organizational Unit">
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.unit" })}
                                        </TableCell>

                                        <TableCell tooltip="Created By">
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.createdby" })}
                                        </TableCell>

                                        <TableCell
                                            tooltip="Type of report"
                                            style={{ width: "50px" }}
                                        >
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.surveytype" })}
                                        </TableCell>

                                        <TableCell tooltip="Number of submitted reports">
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.surveystatus" })}
                                        </TableCell>

                                        <TableCell
                                            tooltip="Total number of reports"
                                            style={{ width: "75px" }}
                                        >
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.total" })}
                                        </TableCell>

                                        <TableCell tooltip="Actions">
                                            {this.props.intl.formatMessage({ "id": "surveylist.table.header.actions" })}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                {surveyList && (


                                    <TableBody>
                                        {surveyList
                                            .slice(this.state.page * this.state.rowsPerPage,
                                                this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row =>
                                                (
                                                    <TableRow
                                                        hover
                                                        key={row.graphId}
                                                        style={{ height: "65px" }}
                                                    >
                                                        <TableCell style={{ whiteSpace: "normal" }}>
                                                            {row.surveyName}
                                                        </TableCell>

                                                        <TableCell style={{ whiteSpace: "normal" }}>
                                                            {row.templateName + " (" + row.templateVersion + ")"}
                                                        </TableCell>

                                                        <TableCell style={{ whiteSpace: "normal" }}>
                                                            {row.unit ? row.unit : "-"}
                                                        </TableCell>

                                                        <TableCell style={{ whiteSpace: "normal" }}>
                                                            {row.createdBy ? row.createdBy : "-"}
                                                        </TableCell>

                                                        <TableCell style={{ width: "50px" }}>
                                                            {row.type === "AD_HOC" ?
                                                                <AdhocIcon
                                                                    nativeColor={grey500}
                                                                    title="Ad-Hoc Survey"
                                                                /> :
                                                                <PersonalizedIcon
                                                                    nativeColor={grey500}
                                                                    title="Personalized Survey"
                                                                />}
                                                            {row.visibility === "ANONYMOUS" ?
                                                                <AnonymousIcon
                                                                    nativeColor={grey500}
                                                                    title="Anonymous Survey"
                                                                /> :
                                                                null}
                                                        </TableCell>

                                                        <TableCell style={{ paddingLeft: "0px" }}>
                                                            <LabeledProgress percentage={row.targetPercentage} />
                                                        </TableCell>

                                                        <TableCell style={{ width: "75px", padding: "0" }}>
                                                            <span style={{ fontSize: "large", fontWeight: "500" }}>
                                                                {row.submittedInstances}
                                                            </span>
                                                            <span>{" /" + row.targetInstances}</span>
                                                        </TableCell>

                                                        <TableCell style={{ overflow: "visible", paddingRight: "0px" }}>

                                                            <Link to={ROUTES.surveyInstances(row.graphId)}>
                                                                <IconButton
                                                                    tooltip="Show all Instances"
                                                                >
                                                                    <InstanceIcon
                                                                        nativeColor={grey500}
                                                                        className={classes.hoverIcon}
                                                                    />
                                                                </IconButton>
                                                            </Link>

                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                    </TableBody>
                                )}

                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            count={surveyList ? surveyList.length : 0}
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
        );
    }
}

export default injectIntl(withStyles(styles, { withTheme: true })(SurveyList));
