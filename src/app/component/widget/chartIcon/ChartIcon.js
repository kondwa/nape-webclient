import AvTimer from "@material-ui/icons/AvTimer";
import BarChart from "@material-ui/icons/InsertChart";
import LineChart from "@material-ui/icons/ShowChart";
import PieChart from "@material-ui/icons/PieChart";
import PropTypes from "prop-types";
import React from "react";
import TableChart from "@material-ui/icons/ViewList";

ChartIcon.propTypes = {
    type: PropTypes.string
};

export default function ChartIcon(props) {

    let icon;

    switch (props.type) {

        case "Bar":
            icon = (<BarChart />);
            break;
        case "Column":
            icon = (<BarChart style={{transform: "rotate(90deg)"}} />);
            break;
        case "PieChart":
            icon = (<PieChart />);
            break;
        case "Line":
            icon = (<LineChart />);
            break;
        case "Table":
            icon = (<TableChart />);
            break;
        case "Gauge":
            icon = (<AvTimer />);
            break;
        default :
            icon = (<TableChart />);
            break;
    }


    return icon;
}
