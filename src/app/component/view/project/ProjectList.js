import * as ROUTES from "../../../common/routes";

import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FilterIcon from "@material-ui/icons/FilterList";
import {Link} from "react-router-dom";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import NewIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import green from "@material-ui/core/colors/green";
import {withStyles} from "@material-ui/core/styles";

const greenA200 = green.A200;

const styles = theme => ({
    button: {
        marginLeft: "30px"
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    card: {
        margin: "30px 30px 0 30px"
    },
    cardActions: {
        zIndex: 2,
        display: "flex",
        justifyContent: "flex-end",
        flexWrap: "wrap"
    },
    cardMedia: {
        margin: "10px"
    },
    hoverIcon: {
        "&:hover": {
            color: greenA200
        }
    },
    disabledLink: {
        pointerEvents: "none"
    }
});

class ProjectList extends Component {

    static propTypes = {
        projectList: PropTypes.array,
        loadProjectList: PropTypes.func,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleRefresh = :: this.handleRefresh;
        this.handleChangePage = ::this.handleChangePage;
        this.handleChangeRowsPerPage = ::this.handleChangeRowsPerPage;

        this.state = {
            page: 0,
            rowsPerPage: 10,
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
            <MLWrapper>

                <div style={{marginTop: "30px"}}>

                    <SectionTitle name={this.props.intl.formatMessage({"id": "projectlist.title"})}>

                        <Button
                            disabled
                            color="primary"
                            className={classes.button}
                            variant="contained"
                        >
                            <NewIcon className={classes.leftIcon}/>
                            {"New"}
                        </Button>

                    </SectionTitle>

                    <Card className={classes.card}>
                        <CardActions className={classes.cardActions}>
                            <Button color="primary">
                                {"Filter"}
                                <FilterIcon/>
                            </Button>
                            <Button color="primary">
                                {"Refresh"}
                                <RefreshIcon/>
                            </Button>
                        </CardActions>

                        <CardContent className={classes.cardMedia}>

                            <div>

                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {this.props.intl.formatMessage({"id": "projectlist.table.header.key"})}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({"id": "projectlist.table.header.name"})}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({"id": "projectlist.table.header.organization"})}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({"id": "projectlist.table.header.start"})}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({"id": "projectlist.table.header.status"})}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {projectList && (

                                        <TableBody>
                                            {projectList
                                                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => (

                                                    <TableRow
                                                        hover
                                                        key={row.id}
                                                        style={{height: "65px"}}
                                                    >

                                                        <TableCell style={{whiteSpace: "normal"}}>
                                                            <Link to={ROUTES.projectDashboard(row.foreignId)}>
                                                                {row.foreignId}
                                                            </Link>
                                                        </TableCell>

                                                        <TableCell style={{whiteSpace: "normal"}}>
                                                            {row.name}
                                                        </TableCell>

                                                        <TableCell style={{whiteSpace: "normal"}}>
                                                            {row.parentName}
                                                        </TableCell>

                                                        <TableCell style={{whiteSpace: "normal"}}>
                                                            {"-"}
                                                        </TableCell>

                                                        <TableCell style={{whiteSpace: "normal"}}>
                                                            {"ONGOING"}
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
                        </CardContent>
                    </Card>
                </div>


            </MLWrapper>

        );
    }
}

export default injectIntl(withStyles(styles, {withTheme: true})(ProjectList));
