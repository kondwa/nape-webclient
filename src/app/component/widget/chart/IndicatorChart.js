import AvTimer from "@material-ui/icons/AvTimer";
import BarChart from "@material-ui/icons/InsertChart";
import Button from "@material-ui/core/Button";
import Charts from "../../widget/chart/Charts";
import GeoChart from "@material-ui/icons/Map";
import LineChart from "@material-ui/icons/ShowChart";
import PieChart from "@material-ui/icons/PieChart";
import PropTypes from "prop-types";
import React from "react";
import TableChart from "@material-ui/icons/ViewList";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import head from "lodash/head";
import {injectIntl} from "react-intl";
import {loadIndicator} from "../../../services/indicators";
import uuid from "uuid";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    title: {
        display: "block",
        color: "rgb(158, 158, 158)",
        marginBottom: "20px"
    },
    content: {
        display: "flex",
        justifyContent: "space-between"
    },
    chart: {
        width: "calc(100% - 130px)",
        marginRight: "30px"
    },
    fullChart: {
        width: "100%"
    },
    helper: {
        width: "80px",
        paddingLeft: "10px",
        borderLeft: `2px solid ${theme.palette.divider}`,
        marginLeft: "20px"
    },
    button: {
        marginBottom: "20px"
    }
});

class IndicatorChart extends React.PureComponent {

    constructor(props) {
        super(props);

        this.handleSwitch = :: this.handleSwitch;

        this.state = {
            indicator: null,
            visualization: props.indicator ? head(props.indicator.indicator.visualizations) : null
        };
    }

    componentDidMount() {
        const {groupName, indicatorKey, loadIndicator} = this.props;

        this.setState({indicator: null});

        if (groupName && indicatorKey) {
            loadIndicator(groupName, indicatorKey);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.indicator !== this.props.indicator) {
            if (nextProps.indicator.key === this.props.indicatorKey) {

                this.setState({
                    indicator: nextProps.indicator.indicator,
                    visualization: head(nextProps.indicator.indicator.visualizations)
                });
            } else {
                this.setState({indicator: null});
            }
        }
    }

    handleSwitch(visualization) {
        this.setState({visualization});
    }

    render() {
        const {classes} = this.props;

        const indicator = this.state.indicator;

        return (
            indicator ?
                (
                    <div>
                        <Typography
                            variant="subtitle1"
                            className={classes.title}
                        >{indicator.name}</Typography>

                        <div className={classes.content}>

                            <div className={this.props.multi ? classes.chart : classes.fullChart}>
                                <Charts
                                    key={uuid.v4()}
                                    chartData={this.state.visualization}
                                />
                            </div>

                            {this.props.multi ? (

                                <div className={classes.helper}>

                                    {indicator.visualizations && indicator.visualizations.map(vis =>
                                        (
                                            <Button
                                                color="primary"
                                                title={vis.chartTitle}
                                                key={uuid.v4()}
                                                className={classes.button}
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
                                        )
                                    )}
                                </div>
                            ) : null}

                        </div>

                    </div>
                ) : null
        );
    }
}

IndicatorChart.propTypes = {
    groupName: PropTypes.string,
    indicatorKey: PropTypes.string,
    multi: PropTypes.bool,
    indicator: PropTypes.object,
    loadIndicator: PropTypes.func,
    classes: PropTypes.object
};

const mapStateToProps = (state) => {
    return {
        indicator: state.indicators.indicator
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadIndicator}, dispatch);
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(IndicatorChart)));
