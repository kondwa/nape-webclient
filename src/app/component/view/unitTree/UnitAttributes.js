import {injectIntl, intlShape} from "react-intl";

import Button from "@material-ui/core/Button";
import {Component} from "react";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";

const styles = () => ({
});

class UnitAttributes extends Component {

    static propTypes = {
        unit: PropTypes.object,
        onSaveUnit: PropTypes.func,
        onDeleteUnit: PropTypes.func,
        onKeyInput: PropTypes.func,
        onNameInput: PropTypes.func,
        onTypeSelect: PropTypes.func,
        intl: intlShape.isRequired,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleSave = :: this.handleSave;
        this.handleDelete = :: this.handleDelete;
        this.handleKeyInput = ::this.handleKeyInput;
        this.handleNameInput = ::this.handleNameInput;
        this.handleTypeSelection = ::this.handleTypeSelection;
    }

    handleDelete() {
        const {unit} = this.props;
        this.props.onDeleteUnit(unit);
    }

    handleSave() {
        const {unit} = this.props;
        this.props.onSaveUnit(unit);
    }

    handleTypeSelection(event) {
        this.props.onTypeSelect(event.target.value);
    }

    handleNameInput(event) {
        this.props.onNameInput(event.target.value);
    }

    handleKeyInput(event) {
        this.props.onKeyInput(event.target.value);
    }

    render() {

        const {unit, classes} = this.props;

        return (

            <div>

                <h5>{this.props.intl.formatMessage({"id": "metadata.attributes.title"})}</h5>

                {
                    unit ? (
                        <div>
                            <TextField
                                fullWidth
                                required
                                className={classes.textField}
                                disabled={typeof(unit.id) !== "undefined"}
                                value={unit.foreignId}
                                label={"Key"}
                                onChange={this.handleKeyInput}
                                helperText={"Please give a unique key"}
                                margin={"normal"}
                            />

                            <TextField
                                fullWidth
                                required
                                className={classes.textField}
                                disabled={unit.type === "Global"}
                                value={unit.name}
                                label={"Name"}
                                onChange={this.handleNameInput}
                                helperText={"Please give a readable name"}
                                margin={"normal"}
                            />

                            <TextField
                                select
                                fullWidth
                                required
                                label={"Type"}
                                className={classes.textField}
                                value={unit.type}
                                onChange={this.handleTypeSelection}
                                SelectProps={{
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                helperText={"Please select the type"}
                                margin={"normal"}
                            >
                                <MenuItem
                                    disabled
                                    value={"Global"}
                                >
                                    {"Global"}
                                </MenuItem>
                                <MenuItem
                                    value={"Organization"}
                                >
                                    {"Organization"}
                                </MenuItem>
                                <MenuItem
                                    value={"Program"}
                                >
                                    {"Program"}
                                </MenuItem>
                                <MenuItem
                                    value={"Project"}
                                >
                                    {"Project"}
                                </MenuItem>
                                <MenuItem
                                    value={"Country"}
                                >
                                    {"Country"}
                                </MenuItem>
                                <MenuItem
                                    value={"Region"}
                                >
                                    {"Region"}
                                </MenuItem>
                                <MenuItem
                                    value={"City"}
                                >
                                    {"City"}
                                </MenuItem>
                            </TextField>

                            <Button
                                color={"primary"}
                                variant={"contained"}
                                disabled={!unit || unit.type === "Global"}
                                style={{margin: "20px 0 0 0"}}
                                onClick={this.handleSave}
                            >
                                {"Save"}
                            </Button>

                            <Button
                                color={"secondary"}
                                variant={"contained"}
                                disabled={!unit || unit.type === "Global"}
                                style={{margin: "20px 0 0 20px"}}
                                onClick={this.handleDelete}
                            >
                                {"Delete"}
                            </Button>

                        </div>
                    ) : (
                        <span>{"Nothing selected"}</span>
                    )
                }

            </div>
        );
    }
}

export default injectIntl(withStyles(styles)(UnitAttributes));
