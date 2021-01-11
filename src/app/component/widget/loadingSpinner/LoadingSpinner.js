import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import React from "react";
import {withStyles} from "@material-ui/core/styles";

const DELAY = 0;

const styles = () => ({
    loading: {
        width: "100%",
        height: "100%",
        zIndex: 1000,
        top: 0,
        left: 0,
        position: "fixed",
        margin: "0 auto",
        opacity: 0.5,
        background: "#000",
        transition: "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
    },
    box: {
        position: "absolute",
        top: "50%",
        left: "50%",
        margin: "20px auto",
        width: 40,
        height: 40
    }
});

const LoadingSpinner = ({open, classes}) => {

    window.setTimeout(() => {
        [].map.call(
            document.getElementsByClassName("loading"),
            (ele) => ele.className += " show"
        );
    }, DELAY);

    return (
        open ?
            (<div className={classes.loading}>
                <div className={classes.box}>
                    <CircularProgress size={100}/>
                </div>
            </div>) : null
    );
};

LoadingSpinner.propTypes = {
    open: PropTypes.bool.isRequired,
    classes: PropTypes.object,
};

export default withStyles(styles)(LoadingSpinner);
