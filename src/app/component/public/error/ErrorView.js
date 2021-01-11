/*
 * Copyright (c) 2018 Mainlevel Consulting AG
 */
import React, {Component} from "react";
import {DATE_TIME_FORMAT} from "../../../common/constant";
import ErrorIcon from "@material-ui/icons/Error";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles/index";

const styles = (theme) => ({
    root: {},
    grid: {
        marginTop: theme.spacing.unit * 2,
    },
    paper: {
        padding: theme.spacing.unit * 3
    },
    errorIcon: {
        color: "red"
    },
    errorMessage: {
        whiteSpace: "pre-wrap"
    }
});

class ErrorView extends Component {

    static propTypes = {
        errors: PropTypes.array,
        selectedError: PropTypes.object,
        errorSelected: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleSelection = ::this.handleSelection;
    }

    handleSelection(index) {
        this.props.errorSelected(index);
    }

    render() {
        const {errors, selectedError, classes} = this.props;

        return (
            <div className={classes.root}>

                <Typography variant={"h5"}>
                    {"An error occurred!"}
                </Typography>

                <Grid
                    className={classes.grid}
                    container
                    spacing={24}
                >

                    <Grid
                        item
                        xs={4}
                    >

                        <Paper className={classes.paper}>

                            <Typography variant={"subtitle1"}>
                                {"List of Errors"}
                            </Typography>

                            <List>
                                {errors && errors.map((error, index) => (

                                    <ListItem
                                        key={index}
                                        button
                                        onClick={() => this.handleSelection(index)}
                                    >
                                        <ListItemIcon className={classes.errorIcon}>
                                            <ErrorIcon color={"error"}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={error.name}
                                            secondary={error.date.format(DATE_TIME_FORMAT)}
                                        />
                                    </ListItem>
                                ))}

                            </List>

                        </Paper>

                    </Grid>

                    <Grid
                        item
                        xs={8}
                    >

                        <Paper className={classes.paper}>

                            <Typography variant={"subtitle1"}>
                                {`${selectedError.name} (${selectedError.date.format(DATE_TIME_FORMAT)})`}
                            </Typography>

                            <Typography variant={"caption"}>
                                <pre className={classes.errorMessage}>
                                    {selectedError.message}
                                </pre>
                            </Typography>

                            <Typography variant={"body1"}>
                                {"Stack Trace"}
                            </Typography>

                            <Typography variant={"caption"}>
                                <pre className={classes.errorMessage}>
                                    {selectedError.stack ? selectedError.stack : "n/a"}
                                </pre>
                            </Typography>

                        </Paper>

                    </Grid>

                </Grid>

            </div>
        );
    }
}

export default withStyles(styles)(ErrorView);

