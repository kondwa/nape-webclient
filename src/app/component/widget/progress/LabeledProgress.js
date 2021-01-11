import LinearProgress from "@material-ui/core/LinearProgress";
import PropTypes from "prop-types";
import React from "react";

LabeledProgress.propTypes = {
    percentage: PropTypes.number
};

const styles = {
    container: {
        position: "relative",
        padding: "5px",
        marginTop: "15px"
    },
    label: {
        position: "absolute",
        top: "-10px",
        width: "50px",
        textAlign: "center",
        zIndex: 1
    },
    line: {
        width: "100%"
    }
};

export default function LabeledProgress(props) {

    return (
        <div style={styles.container}>

            <span style={styles.label}>
                {props.percentage + "%"}
            </span>

            <LinearProgress
                variant="determinate"
                value={props.percentage}
                style={styles.line}
            />

        </div>
    );
}
