import CloudOff from "@material-ui/icons/CloudOff";
import NewIcon from "@material-ui/icons/NewReleases";
import ProgressIcon from "@material-ui/icons/Toys";
import PropTypes from "prop-types";
import React from "react";
import SentIcon from "@material-ui/icons/LocalShipping";
import SvgIcon from "@material-ui/core/SvgIcon";
import amber from "@material-ui/core/colors/amber";
import green from "@material-ui/core/colors/green";
import grey from "@material-ui/core/colors/grey";
import lightGreen from "@material-ui/core/colors/lightGreen";

const amber700 = amber["700"];
const lightGreen200 = lightGreen["200"];
const green300 = green["300"];
const grey500 = grey["500"];

StatusIcon.propTypes = {
    status: PropTypes.string,
};

export default function StatusIcon(props) {


    let icon;
    switch (props.status) {

        case "NEW":
            icon = (<NewIcon nativeColor={lightGreen200}/>);
            break;
        case "IN_PROGRESS":
            icon = (<ProgressIcon nativeColor={amber700}/>);
            break;
        case "SENT":
            icon = (<SentIcon nativeColor={green300}/>);
            break;
        default :
            icon = (<CloudOff nativeColor={grey500}/>);
            break;
    }


    return (<SvgIcon>{icon}</SvgIcon>);

}
