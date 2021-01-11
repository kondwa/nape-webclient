import MobileIcon from "@material-ui/icons/PhoneIphone";
import NoneIcon from "@material-ui/icons/PhonelinkOff";
import PropTypes from "prop-types";
import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import WebIcon from "@material-ui/icons/LaptopMac";
import grey from "@material-ui/core/colors/grey";

const grey500 = grey["500"];

ClientIcon.propTypes = {
    type: PropTypes.string,
};

export default function ClientIcon(props) {

    let icon;
    switch (props.type) {

        case "MOBILE":
            icon = (<MobileIcon nativeColor={grey500}/>);
            break;
        case "WEB":
            icon = (<WebIcon nativeColor={grey500}/>);
            break;
        default :
            icon = (<NoneIcon nativeColor={grey500}/>);
            break;
    }

    return (<SvgIcon>{icon}</SvgIcon>);
}
