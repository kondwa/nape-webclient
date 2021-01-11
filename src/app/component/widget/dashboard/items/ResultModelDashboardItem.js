import * as ROUTES from "../../../../common/routes";

import {RESULT_MODEL, createResultModelAndUpdateDashboard, loadResultModel} from "../../../../services/resultModels";
import {injectIntl, intlShape} from "react-intl";
import Button from "@material-ui/core/Button";
import {Component} from "react";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import JsPlumbEditor from "../../graphEditor/JsPlumbEditor";
import {Link} from "react-router-dom";
import NewIcon from "@material-ui/icons/Add";
import PropTypes from "prop-types";
import React from "react";
import ResultLevel from "../../../view/resultModel/ResultLevel";
import ResultLevelContainer from "../../../view/resultModel/ResultLevelContainer";
import ResultModelDialog from "../../../dialog/resultModel/ResultModelDialog";
import ResultNode from "../../../view/resultModel/ResultNode";
import Typography from "@material-ui/core/Typography";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import find from "lodash/find";

import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const styles = () => ({
    page: {
        height: "549px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between"
    },
    title: {
        display: "block",
        color: "rgb(158, 158, 158)",
        marginBottom: "20px"
    },
    buttons: {
        marginTop: "-10px"
    },
    missing: {
        textAlign: "center"
    },
    message: {
        margin: "0 0 30px 0"
    }
});

class ResultModelDashboardItem extends Component {

    static propTypes = {
        dashboardKey: PropTypes.string,
        dashbaordItemKey: PropTypes.string,
        resultModel: PropTypes.object,
        resultModelId: PropTypes.string,
        createResultModelAndUpdateDashboard: PropTypes.func,
        loadResultModel: PropTypes.func,
        location: PropTypes.object,
        classes: PropTypes.object,
        project: PropTypes.object,
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        this.handleZoomIn = :: this.handleZoomIn;
        this.handleZoomOut = :: this.handleZoomOut;
        this.handleRefresh = :: this.handleRefresh;
        this.handleOpenNewDialog = :: this.handleOpenNewDialog;
        this.handleCloseNewDialog = :: this.handleCloseNewDialog;
        this.handleCreateResultModel = :: this.handleCreateResultModel;

        this.state = {
            zoom: 0.8,
            newDialogOpen: false,
            resultModel: props.resultModel,
            projectId: props.location.pathname.split("/")[2]
        };
    }

    componentDidMount() {
        this.handleRefresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            resultModel: newProps.resultModel,
        });
    }

    handleRefresh() {
        this.setState({resultModel: null});

        const {resultModelId, loadResultModel} = this.props;

        if (resultModelId) {
            loadResultModel(resultModelId);
        }
    }

    handleOpenNewDialog() {
        this.setState({
            newDialogOpen: true
        });
    }

    handleCloseNewDialog() {
        this.setState({
            newDialogOpen: false
        });
    }

    handleCreateResultModel(resultModel) {
        const {dashboardKey, dashbaordItemKey, createResultModelAndUpdateDashboard} = this.props;

        createResultModelAndUpdateDashboard(resultModel, dashboardKey, dashbaordItemKey);
    }

    handleZoomIn() {
        this.setState({zoom: this.state.zoom + 0.1});
    }

    handleZoomOut() {
        this.setState({zoom: this.state.zoom - 0.1});
    }

    render() {
        const {classes, project} = this.props;
        const {resultModel, zoom} = this.state;
        let projectKey = project ? project.foreignId : undefined;

        return (

            <div>

                {resultModel ?
                    (
                        <div className={classes.page}>
                            <div className={classes.header}>
                                <Typography
                                    variant="subtitle1"
                                    className={classes.title}
                                >{resultModel.name}</Typography>

                                <div className={classes.buttons}>

                                    <Link to={ROUTES.resultModel(resultModel.id, projectKey)}>
                                        <IconButton color="primary">
                                            <EditIcon/>
                                        </IconButton>
                                    </Link>

                                    <IconButton
                                        color="primary"
                                        disabled={zoom <= 0.4}
                                        onClick={this.handleZoomOut}
                                    >
                                        <ZoomOutIcon/>
                                    </IconButton>

                                    <IconButton
                                        color="primary"
                                        disabled={zoom >= 1.4}
                                        onClick={this.handleZoomIn}
                                    >
                                        <ZoomInIcon/>
                                    </IconButton>
                                </div>

                            </div>


                            <JsPlumbEditor
                                readOnly
                                model={resultModel}
                                visibleConnectionLabel
                                zoom={zoom}
                            >
                                <ResultLevelContainer>
                                    {resultModel.levels && resultModel.levels.map((level) =>

                                        (
                                            <ResultLevel
                                                key={level.key}
                                                level={level}
                                                visible
                                            />
                                        ))
                                    }
                                </ResultLevelContainer>

                                {resultModel.results && resultModel.results.map((result) =>
                                    (
                                        <ResultNode
                                            key={result.key}
                                            result={result}
                                            level={find(resultModel.levels, {"key": result.level})}
                                            showBadges
                                            indicatorSize={result.indicators ? result.indicators.length : 0}
                                            selected={false}
                                        />
                                    )
                                )}


                            </JsPlumbEditor>

                        </div>

                    ) : (
                        <div>

                            <Typography
                                variant="subtitle1"
                                className={classes.title}
                            >{this.props.intl.formatMessage({"id": "resultModellist.title"})}</Typography>

                            <div className={classes.missing}>

                                <Typography
                                    variant="body1"
                                    className={classes.message}
                                >{this.props.intl.formatMessage({"id": "resultModellist.model.missing"})}</Typography>

                                <ResultModelDialog
                                    open={this.state.newDialogOpen}
                                    onSave={this.handleCreateResultModel}
                                    onClose={this.handleCloseNewDialog}
                                    projectId={this.state.projectId}
                                >

                                    <Button
                                        color="primary"
                                        className={classes.button}
                                        onClick={this.handleOpenNewDialog}
                                        variant="contained"
                                    >
                                        <NewIcon className={classes.leftIcon}/>
                                        {this.props.intl.formatMessage({"id": "resultModellist.create"})}

                                    </Button>

                                </ResultModelDialog>

                            </div>
                        </div>
                    )}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        [RESULT_MODEL]: state.resultModels[RESULT_MODEL]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({loadResultModel, createResultModelAndUpdateDashboard}, dispatch);
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(ResultModelDashboardItem))));
