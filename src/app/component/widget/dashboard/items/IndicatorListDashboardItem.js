import * as ROUTES from "../../../../common/routes";

import {
    INDICATOR_LIST,
    loadIndicatorList,
    updateIndicator
} from "../../../../services/resultIndicators";

import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";

import IconButton from "@material-ui/core/IconButton";
import IndicatorDialog from "../../../dialog/indicator/IndicatorDialog";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {RESULT_MODEL} from "../../../../services/resultModels";
import StatusIcon from "mdi-material-ui/ArrowUpBold";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import green from "@material-ui/core/colors/green";
import {withStyles} from "@material-ui/core/styles";

const greenA200 = green.A200;

const styles = theme => ({
    root: {},
    title: {
        display: "block",
        color: "rgb(158, 158, 158)",
        marginBottom: "20px"
    },
    typo: {
        color: theme.palette.primary.main
    },
    hoverIcon: {
        "&:hover": {
            color: greenA200
        }
    },
    tableBody: {
        display: "block",
        maxHeight: "390px",
        overflow: "auto"
    },
    colName: {
        width: "80%",
    },
    colNameRoot: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    colBase: {
        width: "100px",
        minWidth: "100px",
        maxWidth: "100px",
    },
    colTarget: {
        width: "100px",
        minWidth: "100px",
        maxWidth: "100px",
    },
    colStatus: {
        width: "50px",
        minWidth: "50px",
        maxWidth: "50px"
    }
});

class IndicatorListDashboardItem extends Component {

    static propTypes = {
        indicatorList: PropTypes.array,
        resultModel: PropTypes.object,
        resultModelId: PropTypes.string,
        loadIndicatorList: PropTypes.func,
        updateIndicator: PropTypes.func,
        classes: PropTypes.object,
        project: PropTypes.object,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);

        this.handleRefresh = :: this.handleRefresh;
        this.handleChangePage = ::this.handleChangePage;
        this.handleChangeRowsPerPage = ::this.handleChangeRowsPerPage;
        this.handleOpenIndicatorDialog = :: this.handleOpenIndicatorDialog;
        this.handleCloseIndicatorDialog = :: this.handleCloseIndicatorDialog;
        this.handleSaveIndicator = :: this.handleSaveIndicator;

        this.state = {
            page: 0,
            rowsPerPage: 5,
            indicatorDialogOpen: false,
            selectedIndicator: undefined
        };
    }

    componentDidMount() {

        const resultModelId = this.props.resultModelId ?
            this.props.resultModelId : this.props.resultModel ? this.props.resultModel.id : undefined;

        this.handleRefresh(resultModelId);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.resultModelId !== this.props.resultModelId || newProps.resultModel !== this.props.resultModel) {

            const resultModelId = newProps.resultModelId ?
                newProps.resultModelId : newProps.resultModel ? newProps.resultModel.id : undefined;

            this.handleRefresh(resultModelId);
        }

        this.setState({
            indicatorDialogOpen: false,
            selectedIndicator: undefined
        });
    }

    handleRefresh(resultModelId) {
        const {loadIndicatorList} = this.props;

        if (resultModelId) {
            loadIndicatorList(resultModelId);
        }
    }

    handleChangePage(event, page) {
        this.setState({page});
    }

    handleChangeRowsPerPage(event) {
        this.setState({rowsPerPage: event.target.value});
    }

    handleOpenIndicatorDialog(indicator) {
        this.setState({
            indicatorDialogOpen: true,
            selectedIndicator: indicator
        });
    }

    handleCloseIndicatorDialog() {
        this.setState({
            indicatorDialogOpen: false,
            selectedIndicator: undefined
        });
    }

    handleSaveIndicator(indicator) {
        const {updateIndicator} = this.props;

        updateIndicator(indicator.id, indicator, this.props.indicatorList);

        this.handleRefresh(this.props.resultModel.id);
    }

    render() {

        const {indicatorList, classes, project} = this.props;
        let projectKey = project ? project.foreignId : undefined;

        return (
            <div className={classes.root}>

                <IndicatorDialog
                    open={this.state.indicatorDialogOpen}
                    indicator={this.state.selectedIndicator}
                    onClose={this.handleCloseIndicatorDialog}
                    onUpdate={this.handleSaveIndicator}
                />

                <Typography
                    variant="subtitle1"
                    className={classes.title}
                >{this.props.intl.formatMessage({"id": "indicatorList.title"})}</Typography>

                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.colName}>
                                <Typography
                                    variant="subtitle3"
                                    className={classes.typo}
                                >{this.props.intl.formatMessage({"id": "indicatorList.indicator.title"})}</Typography>
                            </TableCell>
                            <TableCell className={classes.colStatus}>
                                <Typography
                                    variant="subtitle3"
                                    className={classes.typo}
                                >{this.props.intl.formatMessage({"id": "common.status"})}</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                </Table>

                <Table>

                    {indicatorList && (

                        <TableBody className={classes.tableBody}>
                            {indicatorList
                                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((indicator) => (

                                    <TableRow
                                        hover
                                        key={indicator.id}
                                    >
                                        <TableCell className={classes.colName}>
                                            <div className={classes.colNameRoot}>
                                                <Link to={ROUTES.indicator(indicator.id, projectKey)}>
                                                    {indicator.name}
                                                </Link>
                                            </div>
                                        </TableCell>

                                        <TableCell className={classes.colStatus}>
                                            <IconButton

                                                onClick={() => this.handleOpenIndicatorDialog(indicator)}
                                            >
                                                <Tooltip title={indicator.status}>
                                                    <div
                                                        style={{
                                                            transform: indicator.status === "MINOR_DEVIATION" ? "rotate(45deg)" :
                                                                indicator.status === "MAJOR_DEVIATION" ? "rotate(135deg)" :
                                                                    indicator.status === "OFF_TRACK" ? "rotate(180deg)" : undefined,
                                                            color: indicator.status === "MINOR_DEVIATION" ? "orange" :
                                                                indicator.status === "MAJOR_DEVIATION" ? "darkorange" :
                                                                    indicator.status === "OFF_TRACK" ? "red" : "green"
                                                        }}
                                                    >

                                                        <StatusIcon/>

                                                    </div>
                                                </Tooltip>
                                            </IconButton>
                                        </TableCell>

                                    </TableRow>

                                ))}

                        </TableBody>
                    )}

                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={indicatorList ? indicatorList.length : 0}
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
        [INDICATOR_LIST]: state.resultIndicators[INDICATOR_LIST],
        [RESULT_MODEL]: state.resultModels[RESULT_MODEL]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadIndicatorList,
        updateIndicator
    }, dispatch);
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(IndicatorListDashboardItem)));
