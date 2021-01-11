import { injectIntl, intlShape } from "react-intl";
import { Component } from "react";
import Moment from "moment";
import PropTypes from "prop-types";
import React from "react";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { loadSurveyInstanceListFilter } from "../../../../services/surveylist";
import { withRouter } from "react-router-dom";

const styles = {
    page: {
        height: "100px"
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

class LatestSurveySubmitDashboardItem extends Component {

    static propTypes = {
        surveyName: PropTypes.string,
        surveyGid: PropTypes.number,
        surveyInstanceList: PropTypes.array,
        loadSurveyInstanceListFilter: PropTypes.func,
        intl: intlShape.isRequired
    };

    constructor(props) {
        super(props);

        this.state = { latest: null };
    }

    componentDidMount() {
        const { loadSurveyInstanceListFilter, surveyGid } = this.props;
        loadSurveyInstanceListFilter(surveyGid);
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

        return (
            <div>
                <div style={styles.page}>
                    <Typography
                        variant="subtitle1"
                        style={styles.title}
                    >{surveyName}</Typography>

                    <Typography
                        style={styles.text}
                        variant="body2"
                    >{this.props.intl.formatMessage({"id": "surveylist.table.header.submittedBy.latest"})}</Typography>

                    <Typography
                        style={styles.user}
                        variant="body2"
                    >{this.state.latest ? this.state.latest.lastEditUser : "-"}</Typography>

                    <Typography
                        style={styles.time}
                        variant="body2"
                    >{this.state.latest ? Moment(this.state.latest.lastEditTime).format("DD.MM.YYYY HH:mm:ss").toString() : "-"}</Typography>

                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        surveyInstanceList: state.surveyList.surveyInstanceList,
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ loadSurveyInstanceListFilter }, dispatch);
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(LatestSurveySubmitDashboardItem)));

