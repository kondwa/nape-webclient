import * as ROUTES from "../../../common/routes";

import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FilterIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Moment from "moment/moment";
import NewIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import ResultModelDialog from "../../dialog/resultModel/ResultModelDialog";
import ResultModelIcon from "mdi-material-ui/Sitemap";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import green from "@material-ui/core/colors/green";
import { withStyles } from "@material-ui/core/styles";

const greenA200 = green.A200;

const inlineStyle = {
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
    button: {
        marginLeft: "30px"
    },
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
    page: 0,
    rowsPerPage: 10,
    newDialogOpen: false
};

class ResultModelList extends Component {

    static propTypes = {
        resultModelList: PropTypes.array,
        createResultModel: PropTypes.func,
        loadResultModelList: PropTypes.func,
        location: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleRefresh = :: this.handleRefresh;
        this.handleChangePage = :: this.handleChangePage;
        this.handleChangeRowsPerPage = :: this.handleChangeRowsPerPage;
        this.handleOpenNewDialog = :: this.handleOpenNewDialog;
        this.handleCloseNewDialog = :: this.handleCloseNewDialog;

        this.state = {
            ...initialState,
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        this.handleRefresh();
    }

    UNSAFE_componentWillReceiveProps() {
        this.setState(initialState);
    }

    handleRefresh() {
        const { loadResultModelList } = this.props;

        loadResultModelList(this.state.projectId);
    }

    handleCloseNewDialog() {
        this.setState({
            newDialogOpen: false
        });
    }

    handleChangePage(event, page) {
        this.setState({ page });
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleOpenNewDialog() {
        this.setState({
            newDialogOpen: true
        });
    }

    render() {
        const { resultModelList, classes } = this.props;
        return (
            <MLWrapper>

                <div style={{ marginTop: "30px" }}>

                    <SectionTitle
                        name={this.props.intl.formatMessage({ "id": "resultModellist.title" })}
                        enableBack={this.state.projectId !== ("LE" ||"undefined") ? true : false}
                    >
                        <ResultModelDialog
                            open={this.state.newDialogOpen}
                            onSave={(resultModel) => this.props.createResultModel(resultModel)}
                            onClose={this.handleCloseNewDialog}
                            projectId={this.state.projectId}
                        >

                            <Tooltip title={"Deprecated, please use Project Dashboard instead!"}>
                                <Button
                                    color="primary"
                                    className={classes.button}
                                    onClick={this.handleOpenNewDialog}
                                    variant="contained"
                                >
                                    <NewIcon className={classes.leftIcon} />
                                    {"New"}

                                </Button>
                            </Tooltip>

                        </ResultModelDialog>

                    </SectionTitle>

                    <Card style={inlineStyle.card}>
                        <CardActions style={inlineStyle.cardActions}>
                            <Button color="primary">
                                {"Filter"}
                                <FilterIcon />
                            </Button>
                            <Button
                                color="primary"
                                onClick={this.handleRefresh}
                            >
                                {"Refresh"}
                                <RefreshIcon />
                            </Button>
                        </CardActions>

                        <CardContent style={inlineStyle.cardMedia}>

                            <div className="pisa--grid">

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.name" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.description" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.sector" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.author" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.date" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.levels" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.results" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "resultModellist.table.header.actions" })}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {resultModelList ?
                                        (
                                            <TableBody>
                                                {resultModelList
                                                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => (

                                                        <TableRow
                                                            hover
                                                            key={row.id}
                                                            style={{ height: "65px" }}
                                                        >
                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.name}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.description}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.sector}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.author + " (" + row.modifier + ")"}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.modificationTime ? Moment(row.modificationTime).format("DD.MM.YYYY HH:mm:ss").toString() : "-"}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.levels.length}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.results.length}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>

                                                                <Link to={ROUTES.resultModel(row.id)}>
                                                                    <IconButton
                                                                        color="secondary"
                                                                        tooltip="Show Result Model Editor"
                                                                    >
                                                                        <ResultModelIcon className={classes.hoverIcon} />
                                                                    </IconButton>
                                                                </Link>
                                                            </TableCell>

                                                        </TableRow>

                                                    ))}

                                            </TableBody>
                                        ) : null
                                    }

                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                count={resultModelList ? resultModelList.length : 0}
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

export default injectIntl(withStyles(styles, { withTheme: true })(ResultModelList));
