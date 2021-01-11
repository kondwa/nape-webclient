import React, {Component} from "react";

import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import {TwitterPicker} from "react-color";
import cloneDeep from "lodash/cloneDeep";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";

const textColors = ["#383836", "#FBFBFB"];
const backgroundColors = ["#d8e1e9", "#a4b8cc", "#6f90ae", "#496783", "#33485b", "#161f27", "#000000", "#A0C52A", "#ff3f20", "#ffbe00"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const styles = theme => ({
    formControl: {
        minWidth: 120
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
    },
    chip: {
        margin: theme.spacing.unit / 4,
    },
});

class ResultLevelDialog extends Component {

    static propTypes = {
        open: PropTypes.bool,
        level: PropTypes.object,
        onClose: PropTypes.func,
        onApply: PropTypes.func,
        theme: PropTypes.object,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleClose = ::this.handleClose;
        this.handleSave = :: this.handleSave;
        this.handleLabelInput = :: this.handleLabelInput;
        this.handleLabelBlur = :: this.handleLabelBlur;
        this.handleHeightInput = :: this.handleHeightInput;
        this.handleHeightBlur = :: this.handleHeightBlur;
        this.handleDescriptionInput = :: this.handleDescriptionInput;
        this.handleTextColorInput = :: this.handleTextColorInput;
        this.handleNodeColorInput = :: this.handleNodeColorInput;
        this.handleSelectCriteria = :: this.handleSelectCriteria;

        this.state = {
            label: props.level && props.level.label ? props.level.label : "",
            labelErrorText: undefined,
            description: props.level && props.level.description ? props.level.description : "",
            criteria: props.level && props.level.criteria ? cloneDeep(props.level.criteria) : ["SUSTAINABILITY"],
            height: props.level && props.level.style.height ? parseInt(props.level.style.height.replace("px", "")) : 200,
            heightErrorText: undefined,
            textColor: props.level && props.level.nodeStyle.color ? props.level.nodeStyle.color : "",
            nodeColor: props.level && props.level.nodeStyle.background ? props.level.nodeStyle.background : "",
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({
            label: newProps.level && newProps.level.label ? newProps.level.label : "",
            labelErrorText: undefined,
            description: newProps.level && newProps.level.description ? newProps.level.description : "",
            criteria: newProps.level && newProps.level.criteria ? cloneDeep(newProps.level.criteria) : ["SUSTAINABILITY"],
            height: newProps.level && newProps.level.style.height ? parseInt(newProps.level.style.height.replace("px", "")) : 200,
            heightErrorText: undefined,
            textColor: newProps.level && newProps.level.nodeStyle.color ? newProps.level.nodeStyle.color : "",
            nodeColor: newProps.level && newProps.level.nodeStyle.background ? newProps.level.nodeStyle.background : "",
        });
    }

    handleLabelInput(newValue) {
        this.setState({
            label: newValue.target.value,
            labelErrorText: undefined
        });
    }

    handleLabelBlur(event) {
        let newValue = event.target.value;

        if (newValue === "" || newValue === undefined) {
            this.setState({
                labelErrorText: "Name must be defined.",
            });
        }
    }

    handleDescriptionInput(event) {
        this.setState({
            description: event.target.value
        });
    }

    handleSelectCriteria(event) {
        this.setState({
            criteria: event.target.value
        });
    }

    handleHeightInput(event) {
        this.setState({
            height: event.target.value
        });
    }

    handleHeightBlur(event) {
        let newValue = event.target.value;

        if (newValue === "" || newValue === undefined || parseInt(newValue) < 150) {
            this.setState({
                heightErrorText: "Height must be at least 150 px.",
            });
        } else {
            this.setState({
                heightErrorText: undefined,
            });
        }
    }

    handleTextColorInput(color) {
        this.setState({
            textColor: color.hex
        });
    }

    handleNodeColorInput(color) {
        this.setState({
            nodeColor: color.hex
        });
    }


    handleClose() {
        this.props.onClose();
    }

    handleSave() {
        const {level, onApply} = this.props;

        level.label = this.state.label;
        level.description = this.state.description;
        level.style.height = this.state.height + "px";
        level.nodeStyle.background = this.state.nodeColor;
        level.nodeStyle.color = this.state.textColor;
        level.criteria = cloneDeep(this.state.criteria);

        onApply(level);

        this.handleClose();
    }

    render() {

        const {theme, classes} = this.props;

        return (
            <MLWrapper>

                <Dialog open={this.props.open}>

                    <DialogTitle>{"Edit Result Level"}</DialogTitle>

                    <DialogContent>
                        <TextField
                            required
                            label="Name"
                            error={this.state.labelErrorText}
                            value={this.state.label}
                            fullWidth
                            autoFocus
                            onChange={this.handleLabelInput}
                            onBlur={this.handleLabelBlur}
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

                        <FormControl
                            required
                            fullWidth
                            margin="normal"
                            className={classes.formControl}
                        >
                            <InputLabel htmlFor="eval-criteria">{"OECD DAC Criteria"}</InputLabel>

                            <Select
                                multiple
                                value={this.state.criteria}
                                onChange={this.handleSelectCriteria}
                                input={<Input id="eval-criteria"/>}
                                renderValue={selected => (
                                    <div className={classes.chips}>
                                        {selected.map(value => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                className={classes.chip}
                                            />
                                        ))}
                                    </div>
                                )}
                                MenuProps={MenuProps}
                            >
                                <MenuItem
                                    value="SUSTAINABILITY"
                                    style={{
                                        fontWeight:
                                            this.state.criteria.indexOf("SUSTAINABILITY") === -1
                                                ? theme.typography.fontWeightRegular
                                                : theme.typography.fontWeightMedium,
                                    }}
                                >{"Sustainability"}</MenuItem>
                                <MenuItem
                                    value="RELEVANCE"
                                    style={{
                                        fontWeight:
                                            this.state.criteria.indexOf("RELEVANCE") === -1
                                                ? theme.typography.fontWeightRegular
                                                : theme.typography.fontWeightMedium,
                                    }}
                                >{"Relevance"}</MenuItem>
                                <MenuItem
                                    value="IMPACT"
                                    style={{
                                        fontWeight:
                                            this.state.criteria.indexOf("IMPACT") === -1
                                                ? theme.typography.fontWeightRegular
                                                : theme.typography.fontWeightMedium,
                                    }}
                                >{"Impact"}</MenuItem>
                                <MenuItem
                                    value="EFFECTIVENESS"
                                    style={{
                                        fontWeight:
                                            this.state.criteria.indexOf("EFFECTIVENESS") === -1
                                                ? theme.typography.fontWeightRegular
                                                : theme.typography.fontWeightMedium,
                                    }}
                                >{"Effectiveness"}</MenuItem>
                                <MenuItem
                                    value="EFFICIENCY"
                                    style={{
                                        fontWeight:
                                            this.state.criteria.indexOf("EFFICIENCY") === -1
                                                ? theme.typography.fontWeightRegular
                                                : theme.typography.fontWeightMedium,
                                    }}
                                >{"Efficiency"}</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl
                            error={!!this.state.heightErrorText}
                            aria-describedby="height-error"
                            margin="normal"
                        >
                            <InputLabel htmlFor="height">{"Height"}</InputLabel>
                            <Input
                                id="height"
                                type="number"
                                error={!!this.state.heightErrorText}
                                value={this.state.height}
                                onChange={this.handleHeightInput}
                                onBlur={this.handleHeightBlur}
                                endAdornment={<InputAdornment position="end">{"px"}</InputAdornment>}
                            />
                            <FormHelperText id="height-error">{this.state.heightErrorText}</FormHelperText>
                        </FormControl>

                        <TextField
                            disabled
                            label="Node text color"
                            value={this.state.textColor}
                            fullWidth
                            margin="normal"
                        />

                        <TwitterPicker
                            width={250}
                            color={this.state.textColor}
                            colors={textColors}
                            onChangeComplete={this.handleTextColorInput}
                        />

                        <TextField
                            disabled
                            label="Node background color"
                            value={this.state.nodeColor}
                            fullWidth
                            margin="normal"
                            style={{marginTop: "30px"}}
                        />

                        <TwitterPicker
                            width={530}
                            color={this.state.nodeColor}
                            colors={backgroundColors}
                            onChangeComplete={this.handleNodeColorInput}
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
                            disabled={!this.state.label || this.state.heightErrorText}
                            onClick={this.handleSave}
                        >
                            {"Apply"}
                        </Button>
                    </DialogActions>

                </Dialog>

            </MLWrapper>

        );
    }

}

export default injectIntl(withStyles(styles, {withTheme: true})(ResultLevelDialog));
