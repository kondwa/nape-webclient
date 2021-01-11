import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";

import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import FilterIcon from "@material-ui/icons/FilterList";
import IconButton from "@material-ui/core/IconButton";
import Moment from "moment";
import NewIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import RefreshIcon from "@material-ui/icons/Refresh";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TemplateIcon from "@material-ui/icons/Dns";
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

class TemplateList extends Component {

    static propTypes = {
        templateList: PropTypes.array,
        loadTemplateListFilter: PropTypes.func,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {loadTemplateListFilter} = this.props;
        loadTemplateListFilter();
    }

    render() {

        const {templateList, classes} = this.props;

        return (

            <div>

                <SectionTitle
                    name={this.props.intl.formatMessage({"id": "surveylist.title"})}
                >

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
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell tooltip="ID">{"ID"}</TableCell>
                                    <TableCell tooltip="Name">{"Name"}</TableCell>
                                    <TableCell tooltip="Status">{"Status"}</TableCell>
                                    <TableCell tooltip="Created">{"Created"}</TableCell>
                                    <TableCell tooltip="Modified">{"Modified"}</TableCell>
                                    <TableCell/>
                                </TableRow>
                            </TableHead>


                            {templateList && (

                                <TableBody>

                                    {templateList.map((row, index) => (

                                        <TableRow
                                            hover
                                            key={row.identifier}
                                        >
                                            <TableCell>{index}</TableCell>
                                            <TableCell>{row.surveyName}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                            <TableCell>{Moment(row.createdDate).format("MM/DD/YYY").toString()}</TableCell>
                                            <TableCell>{Moment(row.lastModifiedDate).format("MM/DD/YYY").toString()}</TableCell>
                                            <TableCell>
                                                <IconButton
                                                    disabled
                                                    color="secondary"
                                                    tooltip="Open Template Editor"
                                                >
                                                    <TemplateIcon
                                                        className={classes.hoverIcon}
                                                    />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                </TableBody>
                            )}

                        </Table>
                    </CardContent>

                </Card>

            </div>

        );
    }
}


export default injectIntl(withStyles(styles, {withTheme: true})(TemplateList));
