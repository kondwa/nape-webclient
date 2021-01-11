import React, {Component} from "react";

import AddIcon from "@material-ui/icons/AddCircle";
import ArrowLeft from "@material-ui/icons/ArrowBack";
import ArrowRight from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import {DatePicker} from "material-ui-pickers";
import DeleteIcon from "@material-ui/icons/Delete";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from "react-intl";
import moment from "moment/moment";
import {withStyles} from "@material-ui/core/styles";

const styles = () => ({
    milestones: {
        margin: "20px 0 30px 0"
    },
    milestoneBody: {
        display: "flex",
        justifyContent: "space-between"
    },
    milestoneTable: {
        paddingLeft: "20px",
        width: "100%"
    },
    milestoneNo: {
        padding: "0"
    },
    milestoneValue: {
        paddingRight: "5px"
    },
    milestoneDate: {
        width: "100px",
        paddingRight: "10px"
    },
    milestoneAction: {
        padding: "0"
    }
});

const DATE_FORMAT = "MM/DD/YYYY";

const initialState = {
    name: "",
    nameErrorText: undefined,
    description: "",
    baselineValue: "",
    targetValue: "",
    milestones: [],
    status: "ON_TRACK",
    statusComment: ""
};

class IndicatorDialog extends Component {

    static propTypes = {
        children: PropTypes.node,
        open: PropTypes.bool,
        onCreate: PropTypes.func,
        onUpdate: PropTypes.func,
        onClose: PropTypes.func,
        indicator: PropTypes.object,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleNameInput = :: this.handleNameInput;
        this.handleNameBlur = :: this.handleNameBlur;
        this.handleDescriptionInput = :: this.handleDescriptionInput;
        this.handleBaselineInput = :: this.handleBaselineInput;
        this.handleTargetInput = :: this.handleTargetInput;
        this.handleStatusChange = :: this.handleStatusChange;
        this.handleStatusCommentInput = :: this.handleStatusCommentInput;
        this.handleAddMilestone = :: this.handleAddMilestone;
        this.handleDeleteMilestone = :: this.handleDeleteMilestone;
        this.handleMilestoneNameChange = :: this.handleMilestoneNameChange;
        this.handleMilestoneDateChange = :: this.handleMilestoneDateChange;

        this.state = {
            ...initialState,
            milestones: [],
            ...(props.indicator ? props.indicator : undefined)
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            ...initialState,
            milestones: [],
            ...(newProps.indicator ? newProps.indicator : undefined)
        });
    }

    handleClose() {
        this.props.onClose();
    }

    handleNameInput(newValue) {
        this.setState({
            name: newValue.target.value,
            nameErrorText: undefined
        });
    }

    handleNameBlur(event) {
        let newValue = event.target.value;

        if (newValue === "" || newValue === undefined) {
            this.setState({
                nameErrorText: "Name must be defined.",
            });
        }
    }

    handleDescriptionInput(newValue) {
        this.setState({
            description: newValue.target.value
        });
    }

    handleBaselineInput(newValue) {
        this.setState({
            baselineValue: newValue.target.value
        });
    }

    handleTargetInput(newValue) {
        this.setState({
            targetValue: newValue.target.value
        });
    }

    handleStatusCommentInput(newValue) {
        this.setState({
            statusComment: newValue.target.value
        });
    }

    handleStatusChange(newValue) {
        this.setState({
            status: newValue.target.value
        });
    }

    handleMilestoneNameChange(index, newName) {
        const {milestones} = this.state;

        let milestone = milestones[index];
        milestone.name = newName;

        this.setState({milestones});
    }

    handleMilestoneDateChange(index, newDate) {
        const {milestones} = this.state;

        let milestone = milestones[index];
        milestone.date = moment(newDate, DATE_FORMAT).valueOf();

        this.setState({milestones});
    }

    handleAddMilestone() {
        const {milestones} = this.state;

        milestones.push({
            name: "New Milestone",
            date: moment().valueOf()
        });

        this.setState({milestones});
    }

    handleDeleteMilestone(index) {
        const {milestones} = this.state;

        milestones.splice(index, 1);

        this.setState({milestones});
    }

    handleSave() {

        const {onCreate, onUpdate} = this.props;

        const indicator = {
            id: this.state.id,
            name: this.state.name,
            author: this.state.author,
            creationTime: this.state.creationTime,
            description: this.state.description,
            baselineValue: this.state.baselineValue,
            targetValue: this.state.targetValue,
            milestones: this.state.milestones,
            status: this.state.status,
            statusComment: this.state.statusComment,
            reportGroup: this.state.reportGroup,
            reportKey: this.state.reportKey
        };

        if (!this.state.id) {
            onCreate(indicator);
        } else {
            onUpdate(indicator);
        }

        this.handleClose();
    }


    render() {

        const {children, classes} = this.props;

        return (
            <MLWrapper>

                {children}

                <Dialog open={this.props.open}>

                    <DialogTitle>{"Create New Indicator"}</DialogTitle>

                    <DialogContent>
                        <TextField
                            required
                            error={!!this.state.nameErrorText}
                            label="Name"
                            value={this.state.name}
                            fullWidth
                            autoFocus
                            onChange={this.handleNameInput}
                            onBlur={this.handleNameBlur}
                            margin="normal"
                        />

                        <TextField
                            label="Description"
                            value={this.state.description}
                            fullWidth
                            multiline
                            rows={3}
                            onChange={this.handleDescriptionInput}
                            margin="normal"
                        />

                        <TextField
                            label="Baseline Value"
                            value={this.state.baselineValue}
                            fullWidth
                            onChange={this.handleBaselineInput}
                            margin="normal"
                        />

                        <TextField
                            label="Target Value"
                            value={this.state.targetValue}
                            fullWidth
                            onChange={this.handleTargetInput}
                            margin="normal"
                        />

                        <div className={classes.milestones}>

                            <Typography variant="caption">
                                {"Milestones"}
                            </Typography>

                            <div className={classes.milestoneBody}>

                                <div className={classes.milestoneTable}>

                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell className={classes.milestoneNo}>
                                                    {"#"}
                                                </TableCell>
                                                <TableCell className={classes.milestoneValue}>
                                                    {"Name"}
                                                </TableCell>
                                                <TableCell className={classes.milestoneDate}>
                                                    {"Date"}
                                                </TableCell>
                                                <TableCell className={classes.milestoneAction}>
                                                    {""}
                                                </TableCell>
                                            </TableRow>

                                        </TableHead>

                                        <TableBody>

                                            {this.state.milestones && this.state.milestones.map((milestone, index) =>
                                                (
                                                    <TableRow key={index}>
                                                        <TableCell className={classes.milestoneNo}>
                                                            {index + 1}
                                                        </TableCell>
                                                        <TableCell className={classes.milestoneValue}>
                                                            <TextField
                                                                id={"mls_" + index}
                                                                fullWidth
                                                                value={milestone.name}
                                                                onChange={(event) => this.handleMilestoneNameChange(index, event.target.value)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className={classes.milestoneDate}>
                                                            <DatePicker
                                                                clearable
                                                                leftArrowIcon={<ArrowLeft/>}
                                                                rightArrowIcon={<ArrowRight/>}
                                                                autoOk
                                                                invalidLabel={"Invalid Date"}
                                                                emptyLabel={"-"}
                                                                format={DATE_FORMAT}
                                                                value={milestone.date ? moment(milestone.date) : null}
                                                                onChange={(date) => this.handleMilestoneDateChange(index, moment(date).format(DATE_FORMAT))}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            className={classes.milestoneAction}
                                                            style={{paddingRight: "0"}}
                                                        >
                                                            <IconButton
                                                                aria-label="Remove"
                                                                onClick={() => this.handleDeleteMilestone(index)}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }

                                        </TableBody>

                                    </Table>

                                </div>

                                <IconButton
                                    color="primary"
                                    aria-label="Add Milestone"
                                    onClick={this.handleAddMilestone}
                                >
                                    <AddIcon/>
                                </IconButton>

                            </div>

                        </div>

                        <TextField
                            select
                            fullWidth
                            required
                            label="Status"
                            value={this.state.status}
                            onChange={this.handleStatusChange}
                            helperText="Please select the status"
                            margin="normal"
                        >
                            <MenuItem value="ON_TRACK"> {"On Track"}</MenuItem>
                            <MenuItem value="MINOR_DEVIATION"> {"Minor Deviation"}</MenuItem>
                            <MenuItem value="MAJOR_DEVIATION"> {"Major Deviation"}</MenuItem>
                            <MenuItem value="OFF_TRACK"> {"Off Track"}</MenuItem>

                        </TextField>

                        <TextField
                            label="Comment"
                            value={this.state.statusComment}
                            fullWidth
                            multiline
                            rows={3}
                            onChange={this.handleStatusCommentInput}
                            margin="normal"
                        />

                    </DialogContent>

                    <DialogActions>
                        <Button
                            key="cancel"
                            onClick={this.handleClose}
                        >
                            {"Cancel"}
                        </Button>
                        <Button
                            color="primary"
                            key="confirm"
                            disabled={!this.state.name}
                            onClick={this.handleSave}
                        >
                            {"Save"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MLWrapper>

        );
    }

}

export default injectIntl(withStyles(styles, {withTheme: true})(IndicatorDialog));
