import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Chip from "@material-ui/core/Chip";
import {Component} from "react";
import EditIcon from "@material-ui/icons/Build";
import IconButton from "@material-ui/core/IconButton";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import React from "react";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import UserDialog from "./UserDialog";
import green from "@material-ui/core/colors/green";
import {withStyles} from "@material-ui/core/styles";

const greenA200 = green.A200;

const inlineStyle = {
    newButton: {
        "float": "right",
        "marginRight": "30px"
    },
    clearDiv: {
        "clear": "right"
    },
    textColumn: {
        "whiteSpace": "normal",
        "overflow": "none",
        "textOverflow": "clip",
        "overflowWrap": "break-word"
    },
    roleColumn: {
        "width": "60%"
    },
    chip: {
        "margin": 4,
    },
    chipWrapper: {
        "display": "flex",
        "flexWrap": "wrap",
    },
    card: {
        margin: "30px 30px 0 30px"
    },
    cardMedia: {
        margin: "10px"
    }
};

const styles = () => ({
    newButton: {
        "&:hover": {
            color: greenA200
        }
    }
});

class UserList extends Component {

    static propTypes = {
        "userList": PropTypes.array,
        "loadUserListFilter": PropTypes.func,
        "userDialogOpen": PropTypes.bool,
        "openUserDialog": PropTypes.func,
        "closeUserDialog": PropTypes.func,
        "classes": PropTypes.object,
        "theme": PropTypes.object
    };

    constructor(props) {
        super(props);
        this.handleOpenDialog = ::this.handleOpenDialog;
    }

    componentDidMount() {
        const {loadUserListFilter} = this.props;
        loadUserListFilter();
    }

    handleOpenDialog() {
        const {openUserDialog} = this.props;
        openUserDialog();
    }

    render() {
        const {userDialogOpen, userList, closeUserDialog, theme, classes} = this.props;

        const primary_color = theme.palette.primary[500];

        return (
            <MLWrapper>
                <div style={{marginTop: "30px"}}>
                    <SectionTitle name="User Management"/>
                    <UserDialog
                        title="Create new User"
                        open={userDialogOpen}
                        user={undefined}
                        closeDialog={closeUserDialog}
                    >
                        <Button
                            color="primary"
                            className={classes.newButton}
                            variant="contained"
                            style={inlineStyle.newButton}
                            onClick={this.handleOpenDialog}
                        >
                            {"Create new User"}
                        </Button>
                        <div style={inlineStyle.clearDiv}/>
                    </UserDialog>
                </div>

                <Card style={inlineStyle.card}>
                    <CardContent style={inlineStyle.cardMedia}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell tooltip="Identifier">{"ID"}</TableCell>
                                    <TableCell tooltip="First Name">{"First Name"}</TableCell>
                                    <TableCell tooltip="Last Name">{"Last Name"}</TableCell>
                                    <TableCell tooltip="E-Mail">{"E-Mail"}</TableCell>
                                    <TableCell
                                        style={inlineStyle.roleColumn}
                                        tooltip="Roles"
                                    >{"Roles"}</TableCell>
                                    <TableCell tooltip="Actions">{"Actions"}</TableCell>
                                </TableRow>
                            </TableHead>

                            {userList && (

                                <TableBody>
                                    {userList.map((row) => (
                                        <TableRow
                                            key={row.identifier}
                                            hover
                                        >
                                            <TableCell style={inlineStyle.textColumn}>{row.identifier}</TableCell>
                                            <TableCell style={inlineStyle.textColumn}>{row.firstName}</TableCell>
                                            <TableCell style={inlineStyle.textColumn}>{row.lastName}</TableCell>
                                            <TableCell style={inlineStyle.textColumn}>{row.username}</TableCell>
                                            <TableCell style={inlineStyle.roleColumn}>
                                                <div style={inlineStyle.chipWrapper}>
                                                    {row.roles && row.roles.map((role) => (
                                                        <Chip
                                                            key={role.identifier}
                                                            style={inlineStyle.chip}
                                                            label={role.name}
                                                        />
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton color="primary">
                                                    <EditIcon nativeColor={primary_color}/>
                                                </IconButton>

                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            )}
                        </Table>
                    </CardContent>
                </Card>
            </MLWrapper>
        );
    }
}

export default withStyles(styles, {withTheme: true})(UserList);
