import PropTypes from "prop-types";
import React from "react";

const styles = {
    container: {
        width: "100%",
        height: "100%",
        zIndex: 1000,
        top: 0,
        left: 0,
        position: "fixed",
        margin: "0 auto",
    }
};

const JSPlumbOverlay = ({open}) => {

    return (
        open ?
            (<div style={styles.container}/>) : null
    );
};

JSPlumbOverlay.propTypes = {
    open: PropTypes.bool.isRequired,
};

export default JSPlumbOverlay;


