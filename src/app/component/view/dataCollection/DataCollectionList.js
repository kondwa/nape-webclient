import * as ROUTES from "../../../common/routes";

import { injectIntl, intlShape } from "react-intl";

import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { Component } from "react";
import { Link } from "react-router-dom";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import React from "react";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";

const style = {
    card: {
        height: 300,
        width: 300,
        margin: "50px",
        textAlign: "center",
        display: "inline-block"
    },
    cardDisabled: {
        height: 300,
        width: 300,
        margin: "50px",
        textAlign: "center",
        display: "inline-block",
        opacity: 0.5
    },
    cardEnabled: {
        height: 300,
        width: 300,
        margin: "50px",
        textAlign: "center",
        display: "inline-block",
    },
    cardMedia: {
        margin: "10px",
        height: 190
    }
};

class DataCollectionList extends Component {

    static propTypes = {
        intl: intlShape.isRequired,
        location: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            projectId: props.location.pathname.split("/")[2]
        };
    }

    render() {

        return (
            <MLWrapper>
                <div style={{ marginTop: "30px" }}>

                    <SectionTitle
                        name={this.props.intl.formatMessage({ "id": "datacollection.title" })}
                        enableBack={this.state.projectId !== ("LE" ||"undefined") ? true : false}
                    />
                </div>

                <br />

                <div style={{ marginTop: "30px", textAlign: "center" }}>
                    <Card style={style.cardDisabled}>
                        <CardMedia
                            style={style.cardMedia}
                            title="Not Available"
                            image="/images/collection/import.jpg"
                        />
                        <CardContent>
                            <Typography
                                variant="h5"
                                component="h2"
                            >
                                {"Data Import"}
                            </Typography>
                            <Typography component="p">
                                {"Import data from external resources"}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card style={style.cardDisabled}>

                        <CardMedia
                            style={style.cardMedia}
                            title="Not Available"
                            image="/images/collection/manual.jpg"
                        />
                        <CardContent>
                            <Typography
                                variant="h5"
                                component="h2"
                            >
                                {"Manual Input"}
                            </Typography>
                            <Typography component="p">
                                {"Manually insert data"}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Link
                        to={ROUTES.surveys()}
                        style={{ textDecoration: "none" }}
                    >
                        <Card style={style.cardEnabled}>

                            <CardMedia
                                style={style.cardMedia}
                                title="Surveys"
                                image="/images/collection/survey.jpg"
                            />
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    component="h2"
                                >
                                    {"Surveys"}
                                </Typography>
                                <Typography component="p">
                                    {"Collect data from surveys"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Link>
                </div>
            </MLWrapper>
        );
    }

}

export default injectIntl(withRouter(DataCollectionList));
