import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import {Component} from "react";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import IndicatorChart from "../../widget/chart/IndicatorChart";
import IndicatorDialog from "../../dialog/indicator/IndicatorDialog";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import Moment from "moment/moment";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import React from "react";
import SectionTitle from "../../widget/sectionTitle/SectionTitle";
import StatusIcon from "mdi-material-ui/ArrowUpBold";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from "react-intl";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    root: {
        margin: "30px",
        flexGrow: 1,
        marginTop: theme.spacing.unit * 3,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    paper: {
        padding: "16px",
        height: "300px",
        overflowX: "hidden"
    },
    contentScrollBox: {
        height: "268px",
        overflow: "auto",
        overflowX: "hidden"
    },
    chartPaper: {
        padding: "32px",
        height: "400px",
    },
    statsPaper: {
        padding: "16px",
        height: "400px",
    },
    milestoneTitle: {
        paddingLeft: "16px",
        paddingTop: "20px"
    },
    statusText: {
        textAlign: "center"
    },
    milestoneList: {
        marginTop: "10px",
        height: "215px",
        overflow: "auto"
    },
    milestoneNo: {
        width: "25px",
        height: "25px",
        fontSize: "1rem",
        background: theme.palette.secondary.main
    },
    statusPaper: {
        overflow: "hidden"
    }
});

class IndicatorDashboard extends Component {

    static propTypes = {
        indicator: PropTypes.object,
        loadIndicator: PropTypes.func,
        location: PropTypes.object,
        updateIndicator: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleSaveIndicator = :: this.handleSaveIndicator;
        this.handleOpenIndicatorDialog = :: this.handleOpenIndicatorDialog;
        this.handleCloseIndicatorDialog = :: this.handleCloseIndicatorDialog;

        this.state = {
            indicatorDialogOpen: false,
            projectId: props.location.pathname.split("/")[2],
            indicator: null
        };
    }

    componentDidMount() {
        const {loadIndicator} = this.props;

        let indicatorId = this.props.location.pathname.split("/")[4];
        loadIndicator && loadIndicator(indicatorId);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.indicator !== this.state.indicator) {
            this.setState({indicator: nextProps.indicator});
        }
    }

    handleOpenIndicatorDialog() {
        this.setState({
            indicatorDialogOpen: true
        });
    }

    handleCloseIndicatorDialog() {
        this.setState({
            indicatorDialogOpen: false
        });
    }

    handleSaveIndicator(indicator) {
        const {updateIndicator} = this.props;

        updateIndicator(indicator.id, indicator);
    }

    render() {
        const {classes} = this.props;
        const {indicator} = this.state;

        return (

            <MLWrapper>

                <IndicatorDialog
                    open={this.state.indicatorDialogOpen}
                    indicator={indicator}
                    onClose={this.handleCloseIndicatorDialog}
                    onUpdate={this.handleSaveIndicator}
                />

                <div>
                    <div style={{marginTop: "30px"}}>
                        <SectionTitle
                            name={indicator ? indicator.name : "Loading..."}
                            enableBack={this.state.projectId !== ("LE" ||"undefined") ? true : false}
                        >


                            <Button
                                color="primary"
                                className={classes.button}
                                onClick={this.handleOpenIndicatorDialog}
                                variant="contained"
                            >
                                <EditIcon className={classes.leftIcon}/>

                                {"Edit"}

                            </Button>


                        </SectionTitle>
                    </div>

                    {indicator ? (

                        <div className={classes.root}>

                            <Grid
                                container
                                spacing={24}
                            >

                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    lg={3}
                                >
                                    <Paper className={classes.paper}>
                                        <div className={classes.contentScrollBox}>
                                            <List>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Name"
                                                        secondary={indicator.name ? indicator.name : "-"}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Description"
                                                        secondary={indicator.description ? indicator.description : "-"}
                                                    />
                                                </ListItem>
                                            </List>
                                        </div>
                                    </Paper>

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    lg={3}
                                >
                                    <Paper className={classes.paper}>
                                        <div className={classes.contentScrollBox}>
                                            <List>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Baseline Value"
                                                        secondary={indicator.baselineValue ? indicator.baselineValue : "-"}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Target Value"
                                                        secondary={indicator.targetValue ? indicator.targetValue : "-"}
                                                    />
                                                </ListItem>
                                                <ListItem>
                                                    <ListItemText
                                                        primary="Comments"
                                                        secondary={indicator.statusComment ? indicator.statusComment : "-"}
                                                    />
                                                </ListItem>
                                            </List>
                                        </div>
                                    </Paper>

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    lg={3}
                                >
                                    <Paper
                                        className={classes.paper}
                                        style={{ overflow: "hidden" }}
                                    >

                                        <Typography
                                            variant="subtitle1"
                                            className={classes.milestoneTitle}
                                        >
                                            {"Milestones"}
                                        </Typography>

                                        <div className={classes.milestoneList}>

                                            {indicator.milestones && indicator.milestones.length > 0 ? (

                                                <List>
                                                    {indicator.milestones.map((milestone, index) => (
                                                        <ListItem key={milestone.name}>

                                                            <ListItemAvatar>
                                                                <Avatar className={classes.milestoneNo}>
                                                                    {index + 1}
                                                                </Avatar>
                                                            </ListItemAvatar>

                                                            <ListItemText
                                                                primary={milestone.name}
                                                                secondary={milestone.date ? Moment(milestone.date).format("DD.MM.YYYY").toString() : "-"}
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>

                                            ) : (

                                                <Typography
                                                    variant="body2"
                                                    style={{marginTop: "20px", paddingLeft: "24px"}}
                                                >
                                                    {"None"}
                                                </Typography>
                                            )}

                                        </div>

                                    </Paper>

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    lg={3}
                                >
                                    <Paper
                                        className={classes.paper}
                                        style={{display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"}}
                                    >

                                        <div>
                                            <div
                                                style={{
                                                    transform: indicator.status === "MINOR_DEVIATION" ? "rotate(45deg)" :
                                                        indicator.status === "MAJOR_DEVIATION" ? "rotate(135deg)" :
                                                            indicator.status === "OFF_TRACK" ? "rotate(180deg)" : undefined,
                                                    color: indicator.status === "MINOR_DEVIATION" ? "orange" :
                                                        indicator.status === "MAJOR_DEVIATION" ? "darkorange" :
                                                            indicator.status === "OFF_TRACK" ? "red" : "green"
                                                }}
                                            >
                                                <StatusIcon style={{width: "250px", height: "250px"}}/>
                                            </div>

                                            <Typography
                                                variant={"subtitle1"}
                                                className={classes.statusText}
                                            >
                                                {indicator.status === "MINOR_DEVIATION" ? "Minor Deviation" :
                                                    indicator.status === "MAJOR_DEVIATION" ? "Major Deviation" :
                                                        indicator.status === "OFF_TRACK" ? "Off Track" : "On Track"}
                                            </Typography>
                                        </div>

                                    </Paper>

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={9}
                                    lg={9}
                                >
                                    <Paper className={classes.chartPaper}>

                                        {indicator.reportGroup && indicator.reportKey ? (

                                            <IndicatorChart
                                                multi
                                                groupName={indicator.reportGroup}
                                                indicatorKey={indicator.reportKey}
                                            />

                                        ) : (
                                            <Typography
                                                variant="body2"
                                                style={{marginTop: "20px", paddingLeft: "24px"}}
                                            >
                                                {"No report configured"}
                                            </Typography>
                                        )}

                                    </Paper>

                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={3}
                                    lg={3}
                                >
                                    <Paper className={classes.statsPaper}>

                                        <List>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Author"
                                                    secondary={indicator.author ? indicator.author : "-"}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Creation Date"
                                                    secondary={indicator.creationTime ? Moment(indicator.creationTime).format("DD.MM.YYYY HH:mm:ss").toString() : "-"}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Last Modified By"
                                                    secondary={indicator.modifier ? indicator.modifier : "-"}
                                                />
                                            </ListItem>
                                            <ListItem>
                                                <ListItemText
                                                    primary="Last Modified at"
                                                    secondary={indicator.modificationTime ? Moment(indicator.modificationTime).format("DD.MM.YYYY HH:mm:ss").toString() : "-"}
                                                />
                                            </ListItem>
                                        </List>

                                    </Paper>

                                </Grid>

                            </Grid>

                        </div>

                    ) : null}
                </div>

            </MLWrapper>
        );
    }

}

export default injectIntl(withRouter(withStyles(styles, {withTheme: true})(IndicatorDashboard)));
