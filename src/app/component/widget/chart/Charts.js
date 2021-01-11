import React, {Component} from "react";
import {Chart} from "react-google-charts";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core";

const styles = () => ({});

class Charts extends Component {

    static propTypes = {
        chartData: PropTypes.object,
        description: PropTypes.string,
        name: PropTypes.string,
        onWrapperChange: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {};

        this.onWrapperChange = :: this.onWrapperChange;
        this.handleChartData = :: this.handleChartData;
    }

    onWrapperChange(wrapper) {
        if (this.props.onWrapperChange) {
            this.props.onWrapperChange(wrapper);
        }
    }

    handleChartData(data){
        let dataCopy = [];
        if(data instanceof Array){
            data.forEach(function(row){
                let indexOfAnnotation = row.indexOf("ANNOTATION");
                let isTotal = row.indexOf("TOTAL") > -1;
                if(!isTotal && indexOfAnnotation > -1 ){
                    let valueCopy = [];
                    row.forEach(function(value){
                        if(value.toString().includes("ANNOTATION")){
                            valueCopy.push({role: "annotation"});
                        } else {
                            valueCopy.push(value);
                        }
                    });
                    dataCopy.push(valueCopy);
                } else if (!isTotal) {
                    dataCopy.push(row);
                }
            });
        }

        return dataCopy;
    }

    render() {
        const {name, description, chartData} = this.props;

        return (
            <div>
                {name ? (<Typography variant={"body1"}>{name}</Typography>) : null}

                <Chart
                    chartType={chartData.chartType}
                    width={chartData.width}
                    height={chartData.height}
                    rows={chartData.rows}
                    columns={chartData.columns}
                    data={this.handleChartData(chartData.data)}
                    options={chartData.options}
                    legend_toggle={chartData.legend_toggle}
                    chartEvents={chartData.chartEvents}
                    mapsApiKey={"AIzaSyASmwzpR5GdlRiMiNyXGhe5EAj9y5XluLo"}
                    chartPackages={["controls", "corechart", "table", "timeline", "treemap", "wordtree", "gantt", "gauge"]}
                    getChartWrapper={this.onWrapperChange}
                />

                {description ? (<Typography variant={"body2"}>{description}</Typography>) : null}

            </div>
        );
    }
}

export default injectIntl(withStyles(styles)(Charts));
