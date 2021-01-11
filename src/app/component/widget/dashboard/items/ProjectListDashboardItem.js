import * as ROUTES from "../../../../common/routes";

import {
    PROJECT_LIST,
    loadProjectList
} from "../../../../services/units";
import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import green from "@material-ui/core/colors/green";

import {withStyles} from "@material-ui/core/styles";

const greenA200 = green.A200;

const styles = () => ({
    root: {},
    title: {
        display: "block",
        color: "rgb(158, 158, 158)",
        marginBottom: "20px"
    },
    tableBody: {
        overflow: "auto",
        display: "block",
        maxHeight: "285px"
    },
    hoverIcon: {
        "&:hover": {
            color: greenA200
        }
    },
    disabledLink: {
        pointerEvents: "none"
    },
    colName: {
        width: "30%"
    },
    colOrg: {
        width: "30%"
    },
    colStatus: {
        width: "5%"
    },
});

class ProjectListDashboardItem extends Component {

    static propTypes = {
        projectList: PropTypes.array,
        loadProjectList: PropTypes.func,
        classes: PropTypes.object,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);

        this.handleRefresh = :: this.handleRefresh;
        this.handleChangePage = ::this.handleChangePage;
        this.handleChangeRowsPerPage = ::this.handleChangeRowsPerPage;

        this.state = {
            page: 0,
            rowsPerPage: 5,
        };
    }

    componentDidMount() {
        this.handleRefresh();
    }

    handleRefresh() {
        const {loadProjectList} = this.props;
        loadProjectList();
    }

    handleChangePage(event, page) {
        this.setState({page});
    }

    handleChangeRowsPerPage(event) {
        this.setState({rowsPerPage: event.target.value});
    }

    render() {

        const {projectList, classes} = this.props;

        return (
            <div className={classes.root}>
                <Typography
                    variant="subtitle1"
                    className={classes.title}
                >{this.props.intl.formatMessage({"id": "projectList.projects"})}</Typography>

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.colName}>
                                {this.props.intl.formatMessage({"id": "projectList.project"})}
                            </TableCell>
                            <TableCell className={classes.colOrg}>
                                {this.props.intl.formatMessage({"id": "projectList.organization"})}
                            </TableCell>
                            <TableCell className={classes.colStatus}>
                                {this.props.intl.formatMessage({"id": "common.status"})}
                            </TableCell>
                        </TableRow>
                    </TableHead>

                </Table>

                <Table>

                    {projectList && (

                        <TableBody className={classes.tableBody}>
                            {projectList
                                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => (

                                    <TableRow key={row.id}>
                                        <TableCell
                                            style={{whiteSpace: "normal"}}
                                            className={classes.colName}
                                        >
                                            <Link to={ROUTES.projectDashboard(row.foreignId)}>
                                                {row.name + " (" + row.foreignId + ")"}
                                            </Link>
                                        </TableCell>

                                        <TableCell
                                            style={{whiteSpace: "normal"}}
                                            className={classes.colOrg}
                                        >
                                            {row.parentName}
                                        </TableCell>

                                        <TableCell
                                            style={{whiteSpace: "normal"}}
                                            className={classes.colStatus}
                                        >
                                            {this.props.intl.formatMessage({"id": "projectList.ongoing"})}
                                        </TableCell>

                                    </TableRow>

                                ))}

                        </TableBody>
                    )}

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={projectList ? projectList.length : 0}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        [PROJECT_LIST]: state.units[PROJECT_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadProjectList
    }, dispatch);
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(ProjectListDashboardItem)));

