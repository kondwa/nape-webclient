import React, {Component} from "react";
import {injectIntl, intlShape} from "react-intl";
import AvTimer from "@material-ui/icons/AvTimer";
import BarChart from "@material-ui/icons/InsertChart";
import Button from "@material-ui/core/Button";
import Charts from "../../widget/chart/Charts";
import Divider from "@material-ui/core/Divider";
import DownloadIcon from "@material-ui/icons/CloudDownload";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import GeoChart from "@material-ui/icons/Map";
import LineChart from "@material-ui/icons/ShowChart";
import PieChart from "@material-ui/icons/PieChart";
import PropTypes from "prop-types";
import TableChart from "@material-ui/icons/ViewList";
import Typography from "@material-ui/core/Typography";
import head from "lodash/head";
import uuid from "uuid";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    chart: {
        width: "100%",
        margin: "10px"
    },
    indicatorHeading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0,
    },
    indicatorSecondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    action: {
        margin: "0 20px"
    },
    download: {
        marginRight: "auto"
    }
});

class Indicator extends Component {

    static propTypes = {
        open: PropTypes.bool,
        indicator: PropTypes.object,
        classes: PropTypes.object.isRequired,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);

        this.state = {
            open: props.open,
            visualization: head(props.indicator.visualizations),
            chartWrapper: undefined
        };

        this.handleDownloadImage = :: this.handleDownloadImage;
    }

    handleToggle = () => {
        this.setState({open: !this.state.open});
    };

    handleSwitch(visualization) {
        this.setState({visualization: visualization});
    }

    handleDownloadImage() {
        // TODO: Move to redux

        if (this.chartWrapper && this.props.indicator) {

            const chart = this.chartWrapper.getChart();
            const imageURI = chart && chart.getImageURI ? chart.getImageURI() : null;

            if (imageURI) {

                const byteString = atob(imageURI.split(",")[1]);
                const mimeString = imageURI.split(",")[0].split(":")[1].split(";")[0];
                const ab = new ArrayBuffer(byteString.length);

                const ia = new Uint8Array(ab);

                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                const blob = new Blob([ab], {type: mimeString});

                const FileSaver = require("file-saver");
                FileSaver.saveAs(blob, this.props.indicator.name + ".png");
            }
        }

    }

    render() {
        const {indicator, classes} = this.props;

        return (
            <ExpansionPanel
                expanded={this.state.open}
                onChange={this.handleToggle}
            >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                    <Typography className={classes.indicatorHeading}>{indicator.name}</Typography>
                    <Typography className={classes.indicatorSecondaryHeading}>{indicator.description}</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    {this.state.visualization.data && this.state.visualization.data.length > 1 ?
                        (<div className={classes.chart}>
                            <Charts
                                key={uuid.v4()}
                                chartData={this.state.visualization}
                                onWrapperChange={chartWrapper => this.chartWrapper = chartWrapper}
                            />
                        </div>) : (<div className={classes.indicatorSecondaryHeading}><Typography className={classes.indicatorSecondaryHeading}>{this.props.intl.formatMessage({"id": "common.filter.warning"})}</Typography></div>)}

                </ExpansionPanelDetails>

                <Divider/>

                <ExpansionPanelActions>

                    <Button
                        className={classes.download}
                        color="primary"
                        key={uuid.v4()}
                        onClick={this.handleDownloadImage}
                    >
                        <DownloadIcon/>

                    </Button>

                    {indicator.visualizations && indicator.visualizations.map(vis => {
                        return (
                            <Button
                                className={classes.action}
                                color="primary"
                                title={vis.chartTitle}
                                key={uuid.v4()}
                                onClick={() => this.handleSwitch(vis)}
                            >
                                {vis.icon === "Column" ?
                                    <BarChart/> : vis.icon === "Bar" ?
                                        <BarChart

                                            style={{transform: "rotate(90deg)"}}
                                        /> : vis.icon === "Line" ?
                                            <LineChart/> : vis.icon === "Pie" ?
                                                <PieChart/> : vis.icon === "Geo" ?
                                                    <GeoChart/> : vis.icon === "Gauge" ?
                                                        <AvTimer/> :
                                                        <TableChart/>}
                            </Button>
                        );
                    })}
                </ExpansionPanelActions>

            </ExpansionPanel>
        );
    }
}

export default injectIntl(withStyles(styles)(Indicator));
