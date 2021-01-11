import Charts from "../../chart/Charts";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {loadIndicator} from "../../../../services/indicators";
import {withRouter} from "react-router-dom";

const styles = {
    title: {
        display: "block",
        color: "rgb(158, 158, 158)",
        marginBottom: "20px"
    }
};

class IndicatorDashboardItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {indicator: null};
    }

    componentDidMount() {
        const {groupName, indicatorKey, loadIndicator} = this.props;
        loadIndicator(groupName, indicatorKey);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.indicator !== this.props.indicator) {
            if (nextProps.indicator.key === this.props.indicatorKey) {
                this.setState({indicator: nextProps.indicator.indicator});
            }
        }
    }

    render() {
        const indicator = this.state.indicator;

        return (
            indicator ?
                (
                    <div>
                        <Typography
                            variant="subtitle1"
                            style={styles.title}
                        >{indicator.name}</Typography>

                        <Charts chartData={indicator.visualizations[0]}/>
                    </div>
                ) : null

        );
    }
}

IndicatorDashboardItem.propTypes = {
    groupName: PropTypes.string,
    indicatorKey: PropTypes.string,
    indicator: PropTypes.object,
    loadIndicator: PropTypes.func
};

const mapStateToProps = (state) => {
    return {
        indicator: state.indicators.indicator
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadIndicator}, dispatch);
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(IndicatorDashboardItem)));

