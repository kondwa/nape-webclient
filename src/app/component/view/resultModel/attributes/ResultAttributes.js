import * as ROUTES from "../../../../common/routes";

import {
    INDICATORS,
    addIndicator,
    loadIndicators,
    removeIndicator,
    updateIndicator
} from "../../../../services/resultIndicators";
import React, {Component} from "react";

import AddIcon from "@material-ui/icons/Add";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import IconButton from "@material-ui/core/IconButton";
import IndicatorDialog from "../../../dialog/indicator/IndicatorDialog";
import {Link} from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import isEqual from "lodash/isEqual";
import uuid from "uuid";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const styles = () => ({
    avatar: {
        color: "#fff",
        backgroundColor: "rgb(111, 144, 174)",
    },
    details: {
        height: "320px",
        padding: "20px",
        marginBottom: "30px",
        transition: "all 0.5s ease-in"
    },
    detailHeader: {
        display: "flex"
    },
    detailHeaderText: {
        marginTop: "5px",
        marginLeft: "15px"
    },
    indicatorCard: {
        height: "320px",
        padding: "20px"
    },
    indicatorList: {
        marginTop: "20px",
        height: "220px",
        overflow: "auto"
    },
    indicatorItem: {
        paddingRight: "70px"
    },
    addButton: {
        marginLeft: "auto",
        width: 40,
        height: 40
    }
});

class ResultAttributes extends Component {

    static propTypes = {
        modelId: PropTypes.string,
        result: PropTypes.object,
        indicators: PropTypes.array,
        levels: PropTypes.array,
        addIndicator: PropTypes.func,
        updateIndicator: PropTypes.func,
        loadIndicators: PropTypes.func,
        removeIndicator: PropTypes.func,
        onChange: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleNameChange = :: this.handleNameChange;
        this.handleDescriptionChange = :: this.handleDescriptionChange;
        this.handleCloseDialog = :: this.handleCloseDialog;
        this.handleCreateIndicator = :: this.handleCreateIndicator;
        this.handleUpdateIndicator = :: this.handleUpdateIndicator;
        this.handleDeleteIndicator = :: this.handleDeleteIndicator;

        this.handleOpenEditDialog = :: this.handleOpenEditDialog;

        this.state = {
            result: props.result,
            indicators: props.indicators,
            indicatorDialogOpen: false,
            selectedIndicator: undefined
        };
    }

    componentDidMount() {
        const {loadIndicators, result} = this.props;
        loadIndicators(result);
    }

    UNSAFE_componentWillReceiveProps(newProps) {

        const {result, indicators, loadIndicators} = newProps;

        if (!isEqual(this.state.result, result) || !isEqual(this.state.indicators, indicators)) {

            const sameResult = isEqual(this.state.result, result);
            if (sameResult) {
                result.indicators = indicators;
            } else {
                loadIndicators(result);
            }

            this.setState({
                result: result,
                indicators: indicators,
                indicatorDialogOpen: false,
                selectedIndicator: undefined
            }, sameResult ? this.props.onChange : undefined);
        }
    }

    handleNameChange(newValue) {
        const {result} = this.state;
        result.label = newValue.target.value;
        this.setState({result}, this.props.onChange);
    }

    handleDescriptionChange(newValue) {
        const {result} = this.state;
        result.description = newValue.target.value;
        this.setState({result});
    }

    handleCloseDialog() {
        this.setState({
            indicatorDialogOpen: false,
            selectedIndicator: undefined
        });
    }

    handleOpenEditDialog(index) {
        const {result} = this.state;

        if (result.indicators) {
            this.setState({
                selectedIndicator: result.indicators[index],
                indicatorDialogOpen: true
            });
        }
    }

    handleCreateIndicator(indicator, result, modelId) {
        const {addIndicator} = this.props;
        addIndicator(modelId, result, indicator);
    }

    handleUpdateIndicator(indicator) {
        const {updateIndicator} = this.props;
        updateIndicator(indicator.id, indicator, this.state.result.indicators);
    }

    handleDeleteIndicator(index) {
        const {removeIndicator} = this.props;
        const {result} = this.state;
        removeIndicator(result, index);
    }

    render() {
        const {levels, classes, modelId} = this.props;
        const {result, indicatorDialogOpen} = this.state;

        return (

            <div>
                <IndicatorDialog
                    open={indicatorDialogOpen}
                    indicator={this.state.selectedIndicator}
                    onCreate={(indicator) => this.handleCreateIndicator(indicator, result, modelId)}
                    onUpdate={this.handleUpdateIndicator}
                    onClose={this.handleCloseDialog}
                />

                <Paper
                    className={classes.details + " fade-in"}
                    elevation={4}
                >

                    <div className={classes.detailHeader}>

                        <Avatar className={classes.avatar}>{"R"}</Avatar>

                        <Typography
                            className={classes.detailHeaderText}
                            variant="h5"
                        >
                            {"Result Details"}
                        </Typography>

                    </div>

                    <div>

                        <TextField
                            className={classes.textField}
                            label="Name"
                            value={result && result.label ? result.label : ""}
                            onChange={this.handleNameChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            className={classes.textField}
                            label="Description"
                            multiline
                            rows={2}
                            rowsMax={2}
                            value={result && result.description ? result.description : ""}
                            onChange={this.handleDescriptionChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            select
                            disabled
                            className={classes.textField}
                            label="Level"
                            value={result && result.level ? result.level : ""}
                            fullWidth
                            margin="normal"
                        >

                            {levels && levels.map(level => (
                                <MenuItem
                                    key={level.key}
                                    value={level.key}
                                >
                                    {level.label}
                                </MenuItem>
                            ))}
                        </TextField>

                    </div>

                </Paper>


                <Paper
                    className={classes.indicatorCard + " fade-in"}
                    elevation={4}
                >

                    <div className={classes.detailHeader}>

                        <Avatar className={classes.avatar}>{"I"}</Avatar>

                        <Typography
                            variant="h5"
                            className={classes.detailHeaderText}
                        >
                            {"Indicators"}
                        </Typography>

                        <Button
                            color="primary"
                            variant="fab"
                            className={classes.addButton}
                            onClick={() => this.setState({indicatorDialogOpen: true})}
                        >
                            <AddIcon/>
                        </Button>

                    </div>

                    {result.indicators && result.indicators.length > 0 ? (

                        <div className={classes.indicatorList}>
                            <List>

                                {result.indicators.map((indicator, index) => (

                                    <ListItem
                                        button
                                        component={Link}
                                        to={ROUTES.indicator(indicator.id)}
                                        key={uuid.v4()}
                                        className={classes.indicatorItem}
                                    >
                                        <ListItemText
                                            primary={indicator.name}
                                            secondary={indicator.status === "ON_TRACK" ? "On Track" :
                                                indicator.status === "MINOR_DEVIATION" ? "Minor Deviation" :
                                                    indicator.status === "MAJOR_DEVIATION" ? "Major Deviation" : "Off Track"}
                                        />

                                        <ListItemSecondaryAction>
                                            <IconButton
                                                aria-label="Delete"
                                                onClick={() => this.handleOpenEditDialog(index)}
                                            >
                                                <EditIcon/>
                                            </IconButton>
                                            <IconButton
                                                aria-label="Delete"
                                                onClick={() => this.handleDeleteIndicator(index)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>

                                    </ListItem>
                                ))}

                            </List>
                        </div>

                    ) : (

                        <Typography
                            variant="body2"
                            style={{marginTop: "20px"}}
                        >
                            {"No indicators defined"}
                        </Typography>
                    )}

                </Paper>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        indicators: state.resultIndicators[INDICATORS]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({addIndicator, updateIndicator, loadIndicators, removeIndicator}, dispatch);
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(ResultAttributes))));
