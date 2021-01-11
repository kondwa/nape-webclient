import * as ROUTES from "../../../common/routes";

import React, { Component } from "react";
import { injectIntl, intlShape } from "react-intl";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import DocumentDialog from "../../dialog/document/DocumentDialog";
import FilterIcon from "@material-ui/icons/FilterList";
import GeneratorIcon from "@material-ui/icons/Description";
import IconButton from "@material-ui/core/IconButton";
import { Link } from "react-router-dom";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import NewIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import SyncIcon from "@material-ui/icons/Sync";
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

class DocumentList extends Component {

    static propTypes = {
        documentList: PropTypes.array,
        templateList: PropTypes.array,
        createDocument: PropTypes.func,
        loadDocumentListFilter: PropTypes.func,
        loadTemplateList: PropTypes.func,
        synchronizeTemplates: PropTypes.func,
        location: PropTypes.object,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleOpenNewDialog = :: this.handleOpenNewDialog;
        this.handleCloseNewDialog = :: this.handleCloseNewDialog;
        this.handleSynchroniseTemplates = :: this.handleSynchroniseTemplates;
        this.handleChangePage = :: this.handleChangePage;
        this.handleChangeRowsPerPage = :: this.handleChangeRowsPerPage;
        this.state = {
            newDialogOpen: false,
            page: 0,
            rowsPerPage: 10,
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        const { loadDocumentListFilter } = this.props;
        loadDocumentListFilter(this.state.projectId);
    }

    handleChangePage(event, page) {
        this.setState({ page });
    }

    handleChangeRowsPerPage(event) {
        this.setState({ rowsPerPage: event.target.value });
    }

    handleOpenNewDialog() {
        this.setState({
            ...this.state,
            newDialogOpen: true
        });
    }

    handleCloseNewDialog() {
        this.setState({
            newDialogOpen: false
        });
    }

    handleSynchroniseTemplates() {
        const { synchronizeTemplates } = this.props;
        synchronizeTemplates();
    }

    render() {
        const { documentList, classes } = this.props;
        return (
            <MLWrapper>

                <div>
                    <div style={{ marginTop: "30px" }}>
                        <SectionTitle
                            name={this.props.intl.formatMessage({ "id": "documentlist.title" })}
                            enableBack={this.state.projectId !== ("LE" ||"undefined") ? true : false}
                        >
                            <Button
                                color="primary"
                                variant="contained"
                                className={classes.button}
                                onClick={this.handleSynchroniseTemplates}
                            >
                                <SyncIcon
                                    className={classes.leftIcon}
                                />

                                {"Synchronise"}
                            </Button>
                            <DocumentDialog
                                open={this.state.newDialogOpen}
                                projectId={this.state.projectId}
                                templates={this.props.templateList}
                                loadTemplates={this.props.loadTemplateList}
                                saveDocument={this.props.createDocument}
                                onClose={this.handleCloseNewDialog}
                            >
                                <Button
                                    color="primary"
                                    variant="contained"
                                    className={classes.button}
                                    onClick={this.handleOpenNewDialog}
                                >
                                    <NewIcon
                                        className={classes.leftIcon}
                                    />

                                    {this.props.intl.formatMessage({ "id": "documentlist.button.newDocument" })}
                                </Button>
                            </DocumentDialog>
                        </SectionTitle>
                    </div>

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
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "documentlist.table.header.title" })}
                                            </TableCell>
                                            <TableCell>
                                                {"Type"}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "documentlist.table.header.templateName" })}
                                            </TableCell>
                                            <TableCell>
                                                {this.props.intl.formatMessage({ "id": "documentlist.table.header.state" })}
                                            </TableCell>
                                            <TableCell>
                                                {"Action"}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {documentList ?
                                        (
                                            <TableBody>
                                                {documentList
                                                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map(row => (

                                                        <TableRow
                                                            hover
                                                            key={row.id}
                                                            style={{ height: "65px" }}
                                                        >

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.title}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.template.type}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.template.title}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>
                                                                {row.state}
                                                            </TableCell>

                                                            <TableCell style={{ whiteSpace: "normal" }}>

                                                                <Link to={ROUTES.document(row.id)}>
                                                                    <IconButton tooltip="Start Generator">
                                                                        <GeneratorIcon
                                                                            nativeColor={grey500}
                                                                            className={classes.hoverIcon}
                                                                        />
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
                                                count={documentList ? documentList.length : 0}
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

export default injectIntl(withStyles(styles, { withTheme: true })(DocumentList));
