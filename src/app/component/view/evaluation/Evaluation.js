import React, {Component} from "react";

import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import EvaluationMatrix from "./EvaluationMatrix";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import PropTypes from "prop-types";
import SaveIcon from "@material-ui/icons/Save";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    button: {
        marginLeft: "30px"
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    root: {
        flexGrow: 1,
        margin: "30px",
        backgroundColor: theme.palette.background.paper,
    }
});

const initialState = {
    resultModel: null,
    type: "EVALUATION"
};

class Evaluation extends Component {

    static propTypes = {
        loadResultModel: PropTypes.func,
        saveResultModel: PropTypes.func,
        location: PropTypes.object,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleSave = :: this.handleSave;
        this.handleRefresh = :: this.handleRefresh;
        this.handleChangeType = ::this.handleChangeType;
        this.handleChangeEvaluation = ::this.handleChangeEvaluation;

        this.state = initialState;
    }

    componentDidMount() {
        this.handleRefresh();
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            resultModel: newProps.resultModel,
            type: initialState.type
        });
    }

    handleSave() {
        let modelId = this.props.location.pathname.split("/")[4];

        const {saveResultModel} = this.props;
        saveResultModel(modelId, this.state.resultModel);
    }

    handleRefresh() {
        this.setState({
            resultModel: null
        });

        let modelId = this.props.location.pathname.split("/")[4];
        const {loadResultModel} = this.props;
        loadResultModel(modelId);
    }

    handleChangeType(event, value) {
        this.setState({type: value});
    }

    handleChangeEvaluation(evaluation) {
        const {resultModel} = this.state;

        resultModel.evaluation = evaluation;

        this.setState({resultModel});
    }

    render() {

        const {classes} = this.props;

        const {resultModel} = this.state;

        return (
            <MLWrapper>
                <div style={{marginTop: "30px"}}>

                    <SectionTitle name={resultModel ? resultModel.name : null}>

                        <Button
                            color="primary"
                            variant="contained"
                            className={classes.button}
                            onClick={this.handleSave}
                        >
                            <SaveIcon className={classes.leftIcon}/>

                            {"Save"}

                        </Button>

                    </SectionTitle>

                </div>

                <div className={classes.root}>

                    <AppBar position="static">
                        <Tabs
                            value={this.state.type}
                            onChange={this.handleChangeType}
                            indicatorColor="secondary"
                            centered
                        >
                            <Tab
                                label="Evaluation Matrix"
                                value="EVALUATION"
                            />
                            <Tab
                                disabled
                                label="Contribution Analysis"
                                value="CONTRIBUTION"
                            />

                        </Tabs>
                    </AppBar>

                    {resultModel ? (

                        <div>

                            {this.state.type === "EVALUATION" && (
                                <EvaluationMatrix
                                    model={resultModel}
                                    onChange={this.handleChangeEvaluation}
                                />
                            )}

                        </div>

                    ) : null}


                </div>

            </MLWrapper>
        );
    }
}

export default injectIntl(withStyles(styles, {withTheme: true})(Evaluation));
