import {injectIntl, intlShape} from "react-intl";
import {Component} from "react";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import find from "lodash/find";

import {loadSurveyInstanceSize} from "../../../../services/surveylist";
import {withRouter} from "react-router-dom";

const styles = {
    page: {
        height: "100px"
    },
    title: {
        display: "block",
        fontSize: "61px",
        fontWeight: "500",
        textAlign: "right",
        color: "black"
    },
    text: {
        textAlign: "left",
        display: "block",
        color: "rgb(158, 158, 158)"
    }
};

class SurveySubmitCountDashboardItem extends Component {

    static propTypes = {
        surveyName: PropTypes.string,
        surveyGid: PropTypes.number,
        loadSurveyInstanceSize: PropTypes.func,
        sizes: PropTypes.array,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {surveyGid, loadSurveyInstanceSize} = this.props;
        loadSurveyInstanceSize(surveyGid);
    }

    render() {
        const {surveyGid, surveyName, sizes} = this.props;

        const size = sizes ? find(sizes, {surveyGid}) : undefined;

        return (
            <div style={styles.page}>

                <Typography
                    style={styles.title}
                    title={surveyName}
                >
                    {size && size.surveyInstanceListSize ? size.surveyInstanceListSize : "-"}
                </Typography>

                <Typography
                    variant="subtitle1"
                    style={styles.text}
                >{this.props.intl.formatMessage({"id": "reports.submitted"})}</Typography>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        sizes: state.surveyList.surveyInstanceListSize
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadSurveyInstanceSize}, dispatch);
};


export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(SurveySubmitCountDashboardItem)));
