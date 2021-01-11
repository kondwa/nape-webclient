import CircularProgress from "@material-ui/core/CircularProgress";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";

const style = {
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
    },
    title: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "30px"
    },
    buttons: {
        marginRight: "30px",
        marginLeft: "30px",
        display: "flex",
        alignItems: "baseline",
        justifyContent: "flex-end"
    }
};

const SectionTitle = (props) => (

    <div style={style.sectionHeader}>
        <div style={style.sectionHeader}>

            <Typography
                variant="h5"
                style={style.title}
            >
                {props.name ? props.name : (
                    <CircularProgress size={24} />
                )}
            </Typography>
        </div>
        {props.children ?
            (
                <div style={{ ...style.buttons, minWidth: (props.children.length * 150) + "px" }}>
                    {props.children}
                </div>
            ) : null
        }
    </div>

);

export default SectionTitle;

SectionTitle.propTypes = {
    name: PropTypes.string,
    children: PropTypes.any
};
