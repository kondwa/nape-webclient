import Button from "@material-ui/core/Button";
import {Component} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import {cloneDeep} from "lodash";
import {find} from "lodash";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    }
});

const initialState = {
    name: "",
    nameErrorText: undefined,
    description: "",
    sector: "",
    sectorErrorText: undefined,
    terminology: "",
    terminologyErrorText: undefined,
    levels: []
};

const terminologies = [
    {
        key: "1",
        name: "EU Terminology",
        levels: [{
            key: "eu1",
            label: "Overall Objectives",
            criteria: ["RELEVANCE", "IMPACT", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#383836",
                background: "#d8e1e9"
            }
        }, {
            key: "eu2",
            label: "Purpose",
            criteria: ["RELEVANCE", "EFFECTIVENESS", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#fbfbfb",
                background: "#a4b8cc"
            }
        }, {
            key: "eu3",
            label: "Result",
            criteria: ["EFFICIENCY", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#fbfbfb",
                background: "#6f90ae"
            }
        }]
    },
    {
        key: "2",
        name: "OECD-DAC Terminology",
        levels: [{
            key: "oecd1",
            label: "Impact",
            criteria: ["RELEVANCE", "IMPACT", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#383836",
                background: "#d8e1e9"
            }
        }, {
            key: "oecd2",
            label: "Outcome",
            criteria: ["RELEVANCE", "EFFECTIVENESS", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#fbfbfb",
                background: "#a4b8cc"
            }
        }, {
            key: "oecd3",
            label: "Output",
            criteria: ["EFFICIENCY", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#fbfbfb",
                background: "#6f90ae"
            }
        }]
    },
    {
        key: "3",
        name: "Custom Terminology",
        levels: [{
            key: "cu1",
            label: "Result 1",
            criteria: ["RELEVANCE", "IMPACT", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#383836",
                background: "#d8e1e9"
            }
        }, {
            key: "cu2",
            label: "Result 2",
            criteria: ["RELEVANCE", "EFFECTIVENESS", "SUSTAINABILITY"],
            style: {},
            nodeStyle: {
                color: "#fbfbfb",
                background: "#a4b8cc"
            }
        }]
    }
];

class ResultModelDialog extends Component {

    static propTypes = {
        children: PropTypes.node,
        open: PropTypes.bool,
        onSave: PropTypes.func,
        onClose: PropTypes.func,
        projectId: PropTypes.string,
        classes: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleNameInput = :: this.handleNameInput;
        this.handleDescriptionInput = :: this.handleDescriptionInput;
        this.handleTerminologyChange = :: this.handleTerminologyChange;
        this.handleChangeLevel = :: this.handleChangeLevel;

        this.state = {
            ...initialState,
            open: this.props.open
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            ...initialState,
            open: newProps.open
        });
    }

    handleNameInput(newValue) {
        this.setState({
            name: newValue.target.value,
            nameErrorText: undefined
        });
    }

    handleDescriptionInput(newValue) {
        this.setState({
            description: newValue.target.value
        });
    }

    handleClose() {
        this.props.onClose();
    }

    handleTerminologyChange(event) {

        const value = event.target.value;
        const terminology = find(terminologies, {"key": value});

        this.setState({
            terminology: value,
            terminologyErrorText: undefined,
            levels: terminology ? cloneDeep(terminology.levels) : []
        });
    }

    handleChangeLevel(event) {

        const levels = this.state.levels.slice();

        let level = find(levels, {key: event.target.id});
        level.label = event.target.value;

        this.setState({levels: levels});
    }

    handleSave() {

        const {onSave} = this.props;

        const levels = this.state.levels;

        const model = {
            name: this.state.name,
            description: this.state.description,
            sector: this.state.sector,
            projectId: this.props.projectId,
            status: "ACTIVE",
            levels: levels,
            results: [],
            connections: []
        };

        onSave(model);

        this.handleClose();
    }

    render() {

        const {children, classes} = this.props;

        const actions = [
            <Button
                key="cancel"
                onClick={this.handleClose}
            >
                {"Cancel"}
            </Button>,
            <Button
                key="confirm"
                disabled={!this.state.name || !this.state.terminology}
                onClick={this.handleSave}
            >
                {"OK"}
            </Button>
        ];

        return (
            <MLWrapper>

                {children}

                <Dialog open={this.state.open}>

                    <DialogTitle>{"Create New Result Model"}</DialogTitle>

                    <DialogContent>
                        <TextField
                            className={classes.textField}
                            label="Name"
                            value={this.state.name}
                            fullWidth
                            autoFocus
                            onChange={this.handleNameInput}
                            margin="normal"
                        />

                        <TextField
                            className={classes.textField}
                            label="Description"
                            value={this.state.description}
                            fullWidth
                            onChange={this.handleDescriptionInput}
                            margin="normal"
                        />

                        <TextField
                            select
                            fullWidth
                            required
                            label="Terminology"
                            className={classes.textField}
                            value={this.state.terminology}
                            onChange={this.handleTerminologyChange}
                            helperText="Please select the terminology"
                            margin="normal"
                        >
                            {terminologies && terminologies.map(terminology => (
                                <MenuItem
                                    key={terminology.key}
                                    value={terminology.key}
                                >
                                    {terminology.name}
                                </MenuItem>
                            ))}

                        </TextField>

                        {this.state.levels && this.state.levels.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            {"Level"}
                                        </TableCell>
                                        <TableCell>
                                            {"Name"}
                                        </TableCell>
                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {this.state.levels && this.state.levels.map((level, i) =>
                                        (
                                            <TableRow
                                                key={level.key}
                                            >
                                                <TableCell>
                                                    {"Level-" + (i + 1)}
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        id={level.key}
                                                        fullWidth
                                                        value={level.label}
                                                        className={classes.textField}
                                                        onChange={this.handleChangeLevel}
                                                    />
                                                </TableCell>


                                            </TableRow>
                                        ))
                                    }

                                </TableBody>

                            </Table>
                        ) : null
                        }

                    </DialogContent>

                    <DialogActions>
                        {actions}
                    </DialogActions>
                </Dialog>
            </MLWrapper>
        );
    }
}


export default injectIntl(withStyles(styles, {withTheme: true})(ResultModelDialog));
