import { injectIntl, intlShape } from "react-intl";
import { Component } from "react";
//import Moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import find from "lodash/find";

import { loadSurveyInstanceListFilter } from "../../../../services/surveylist";
import { loadSurveyInstanceSize } from "../../../../services/surveylist";
import { withRouter } from "react-router-dom";

const styles = {
    page: {
        height: "auto"
    },
    title: {
        color: "rgb(158, 158, 158)",
        display: "block"
    },
    text: {
        textAlign: "left",
        float: "left",
        margin: "30px 0px 0px 0px",
    },
    titleCount: {
        fontSize: "51px",
        fontWeight: "500",
        textAlign: "right",
        float: "right",
        color: "black"
    },
    textCount: {
        textAlign: "left",
        float: "left",
        color: "rgb(158, 158, 158)"
    },
    user: {
        margin: "20px 0px 5px 0px",
        display: "block",
        textAlign: "right",
    },
    time: {
        margin: "10px 0px 5px 0px",
        textAlign: "right"
    }
};

class LatestSurveyCountSubmitDashboardItem extends Component {

    static propTypes = {
        surveyName: PropTypes.string,
        surveyGid: PropTypes.number,
        surveyInstanceList: PropTypes.array,
        loadSurveyInstanceListFilter: PropTypes.func,
        loadSurveyInstanceSize: PropTypes.func,
        sizes: PropTypes.array,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);

        this.state = { latest: null };
    }

    componentDidMount() {
        const { loadSurveyInstanceListFilter, loadSurveyInstanceSize, surveyGid } = this.props;
        loadSurveyInstanceListFilter(surveyGid);
        loadSurveyInstanceSize(surveyGid);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.surveyInstanceList !== this.props.surveyInstanceList) {

            let latest = _.head(_.filter(nextProps.surveyInstanceList, { status: "SENT" }));
            if (latest && latest.templateTitle && latest.templateTitle.toLowerCase() === this.props.surveyName.toLowerCase()) {
                this.setState({ latest: latest });
            }
        }
    }

    render() {
        const { surveyName } = this.props;
        const { surveyGid, sizes } = this.props;
        const size = sizes ? find(sizes, { surveyGid }) : undefined;

        return (
            <div>
                <div style={styles.page}>
                    <Typography
                        variant="subtitle1"
                        style={styles.title}
                    >{surveyName}</Typography>
                </div>
                <hr /><br />
                <div>
                    <Typography
                        variant="subtitle1"
                        style={styles.textCount}
                    >{this.props.intl.formatMessage({"id": "reports.submitted"})}</Typography>

                    <Typography
                        style={styles.titleCount}
                        title={surveyName}
                    >
                        {size && size.surveyInstanceListSize ? size.surveyInstanceListSize : "-"}
                    </Typography>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        surveyInstanceList: state.surveyList.surveyInstanceList,
        sizes: state.surveyList.surveyInstanceListSize
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loadSurveyInstanceListFilter, loadSurveyInstanceSize }, dispatch);
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(LatestSurveyCountSubmitDashboardItem)));
