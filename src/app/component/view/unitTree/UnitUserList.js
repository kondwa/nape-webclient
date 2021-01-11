import { injectIntl, intlShape } from "react-intl";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { Component } from "react";
import ContentAdd from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fab } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import React from "react";
import find from "lodash/find";
import pull from "lodash/pull";
import uuid from "uuid";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    addButton: {
        float: "right",
        margin: "-60px 5px 0 0",
        width: 40,
        height: 40
    },
    avatar: {
        backgroundColor: theme.palette.primary.main
    }
});

class UnitUserList extends Component {

    static propTypes = {
        unit: PropTypes.object,
        userList: PropTypes.array,
        unitUserList: PropTypes.array,
        loadUserList: PropTypes.func,
        saveUserList: PropTypes.func,
        removeUserParticipation: PropTypes.func,
        classes: PropTypes.object,
        theme: PropTypes.object,
        intl: intlShape.isRequired
    };

    constructor( props ) {
        super(props);

        this.handleOpenDialog = :: this.handleOpenDialog;
        this.handleCloseDialog = :: this.handleCloseDialog;
        this.handleSaveParticipation = :: this.handleSaveParticipation;
        this.handleDialogUserSelection = :: this.handleDialogUserSelection;
        this.handleRemoveParticipation = :: this.handleRemoveParticipation;

        this.state = { dialogOpen: false, selectedUsers: [] };
    }

    handleOpenDialog() {
        const { loadUserList } = this.props;

        loadUserList();

        this.setState({ dialogOpen: true });
    }

    handleSaveParticipation() {
        const { unit, saveUserList } = this.props;

        saveUserList(unit.foreignId, this.state.selectedUsers);

        this.handleCloseDialog();
    }

    handleRemoveParticipation( user ) {
        const { unit, removeUserParticipation } = this.props;

        if ( user ) {
            removeUserParticipation(unit.foreignId, user.graphId, user.username);
        }
    }

    handleCloseDialog() {
        this.setState({ dialogOpen: false, selectedUsers: [] });
    }

    handleDialogUserSelection( user ) {
        let selectedUsers = this.state.selectedUsers;
        let selectedUser = find(selectedUsers, { "username": user.username });

        if ( selectedUser ) {
            pull(selectedUsers, selectedUser);
        } else {
            selectedUsers.push({
                name: user.firstName + " " + user.lastName,
                username: user.username,
                roles: []
            });
        }

        this.setState({ selectedUsers: selectedUsers });
    }

    render() {
        const { unit, userList, unitUserList, classes, theme } = this.props;
        const primary_color = theme.palette.primary[ 500 ];

        const dialogActions = [
            <Button
                key={uuid.v4()}
                color={"primary"}
                onClick={this.handleCloseDialog}
            >
                {"Cancel"}
            </Button>,
            <Button
                key={uuid.v4()}
                color={"primary"}
                onClick={this.handleSaveParticipation}
            >
                {"Add"}
            </Button>,
        ];

        return (
            <MLWrapper>

                <h5>{this.props.intl.formatMessage({ "id": "metadata.participants.title" })}</h5>

                {
                    unitUserList ?

                        (
                            <div>
                                <Fab
                                    color={"primary"}

                                    disabled={!unit || !unit.id}
                                    onClick={this.handleOpenDialog}
                                    className={classes.addButton}
                                >
                                    <ContentAdd color={primary_color} />
                                </Fab>

                                {unitUserList.length > 0 ?
                                    (
                                        <List>
                                            {unitUserList.map(( user ) => (
                                                (
                                                    <ListItem
                                                        key={uuid.v4()}
                                                        button
                                                    >
                                                        <ListItemAvatar>
                                                            <Avatar
                                                                className={classes.avatar}
                                                            >
                                                                {user.roles.map(( role ) => {
                                                                    switch ( role ) {
                                                                        case "ASSISTANT":
                                                                            return "A";
                                                                        case "ADMIN":
                                                                            return "*";
                                                                        case "MANAGER":
                                                                            return "M";
                                                                        case "OWNER":
                                                                            return "O";
                                                                        default:
                                                                            return role.charAt(0);
                                                                    }
                                                                })}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={user.name}
                                                            secondary={user.username}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <IconButton
                                                                onClick={() => this.handleRemoveParticipation(user)}
                                                                aria-label={"Delete"}
                                                                color={"primary"}
                                                            >
                                                                <DeleteIcon color={primary_color}/>
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )))
                                            }
                                        </List>
                                    ) : (
                                        <span>{"No participants"}</span>
                                    )

                                }
                            </div>
                        ) : (
                            <span>{"Nothing selected"}</span>
                        )

                }

                <Dialog
                    onClose={this.handleCloseDialog}
                    onBackdropClick={this.handleCloseDialog}
                    onEscapeKeyDown={this.handleCloseDialog}
                    open={this.state.dialogOpen}
                >
                    <DialogTitle>{"Add Participants"}</DialogTitle>
                    <DialogContent>
                        {userList && userList.length > 0 ?
                            (
                                <List>
                                    {userList.map(( user ) => (
                                        (
                                            <ListItem
                                                key={uuid.v4()}
                                                dense
                                                button
                                                onClick={() => this.handleDialogUserSelection(user)}
                                            >
                                                <Checkbox
                                                    checked={!!find(this.state.selectedUsers, { username: user.username })}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                                <ListItemText
                                                    primary={user.firstName + " " + user.lastName}
                                                    secondary={user.username}
                                                />
                                            </ListItem>
                                        )
                                    ))
                                    }
                                </List>

                            ) : (
                                <span>{"No users found."}</span>
                            )
                        }
                    </DialogContent>
                    <DialogActions>
                        {dialogActions}
                    </DialogActions>
                </Dialog>
            </MLWrapper>
        );

    }
}

export default injectIntl(withStyles(styles, { withTheme: true })(UnitUserList));
