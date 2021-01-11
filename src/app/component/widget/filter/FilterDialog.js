import ArrowLeft from "@material-ui/icons/ArrowBack";
import ArrowRight from "@material-ui/icons/ArrowForward";
import Button from "@material-ui/core/Button";
import {Component} from "react";
import {DatePicker} from "material-ui-pickers";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MLWrapper from "../../widget/wrapper/MLWrapper";
import MenuItem from "@material-ui/core/MenuItem";
import PropTypes from "prop-types";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from "react-intl";
import moment from "moment/moment";
import {withStyles} from "@material-ui/core/styles";

const styles = theme => ({
    dialog: {},
    filter: {
        display: "flex",
        height: "75px"
    },
    control: {
        width: "100%",
        display: "flex",
    },
    date: {
        marginTop: "12px"
    },
    label: {
        fontSize: theme.typography.pxToRem(15),
        width: "300px",
        lineHeight: "60px"
    },
    helperText: {
        fontSize: "0.75rem",
        marginTop: "8px",
        color: "rgba(0, 0, 0, 0.54)",
        lineHeight: "1em"
    },
    leftButton: {
        marginRight: "auto"
    },
    textField: {
        //width: "500px"
    }
});

const DATE_FORMAT = "MM/DD/YYYY";

const initialState = {
    values: {}
};

class FilterDialog extends Component {

    static propTypes = {
        open: PropTypes.bool,
        filters: PropTypes.array,
        onApply: PropTypes.func,
        onClose: PropTypes.func,
        classes: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.handleClose = ::this.handleClose;
        this.handleApply = :: this.handleApply;
        this.handleChange = :: this.handleChange;
        this.handleClear = :: this.handleClear;

        this.state = {
            ...initialState,
            open: this.props.open
        };
    }

    handleClose() {
        const {onClose} = this.props;
        onClose();
    }

    handleApply() {
        const {onApply} = this.props;
        onApply(this.state.values);

        this.handleClose();
    }

    handleChange(filter, event) {
        const {values} = this.state;

        let value;

        switch (filter.type) {
            case "DATE":
                value = moment.utc(event, DATE_FORMAT).valueOf();
                break;

            case "SINGLE_SELECTION":
                value = event.target.value;
                break;

            default:
                break;
        }

        if (value) {
            values[filter.name] = value;
        } else {
            delete values[filter.name];
        }

        this.setState({values});
    }

    handleClear() {
        this.setState({values: {}});
    }

    render() {

        const {filters, classes} = this.props;

        const {values} = this.state;

        return (
            <MLWrapper>
                <Dialog
                    open={this.props.open}
                    className={classes.dialog}
                    onClose={this.handleClose}
                >

                    <DialogTitle>{"Filters"}</DialogTitle>

                    <DialogContent>

                        {filters && filters.map((filter) => (

                            <div
                                className={classes.filter}
                                key={filter.name}
                            >

                                <Typography
                                    className={classes.label}
                                    gutterBottom
                                >
                                    {filter.label}
                                </Typography>

                                <div className={classes.control}>
                                    {filter.type === "DATE" ?
                                        (
                                            <div className={classes.date}>
                                                <DatePicker
                                                    clearable
                                                    leftArrowIcon={<ArrowLeft/>}
                                                    rightArrowIcon={<ArrowRight/>}
                                                    autoOk
                                                    animateYearScrolling
                                                    invalidLabel={"-"}
                                                    emptyLabel={"-"}
                                                    format={DATE_FORMAT}
                                                    value={values[filter.name] ? moment.utc(values[filter.name]) : null}
                                                    onChange={(date) => this.handleChange(filter, moment.utc(date).format(DATE_FORMAT))}
                                                />
                                                <Typography
                                                    className={classes.helperText}
                                                    variant="caption"
                                                    gutterBottom
                                                    noWrap
                                                >
                                                    {filter.description}
                                                </Typography>
                                            </div>
                                        ) : filter.type === "SINGLE_SELECTION" ?
                                            (
                                                <TextField
                                                    select
                                                    fullWidth
                                                    className={classes.textField}
                                                    value={values[filter.name] ? values[filter.name] : ""}
                                                    onChange={(event) => this.handleChange(filter, event)}
                                                    helperText={filter.description}
                                                    margin="normal"
                                                >
                                                    <MenuItem value={""}><em>{"None"}</em></MenuItem>

                                                    {filter.options && filter.options.map(option => (
                                                        <MenuItem
                                                            key={option.name}
                                                            value={option.value}
                                                        >
                                                            {option.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            ) : null
                                    }

                                </div>

                            </div>

                        ))}

                    </DialogContent>

                    <DialogActions>
                        <Button
                            key="clear"
                            onClick={this.handleClear}
                            className={classes.leftButton}
                        >
                            {"Clear"}
                        </Button>
                        <Button
                            key="cancel"
                            onClick={this.handleClose}
                        >
                            {"Cancel"}
                        </Button>
                        <Button
                            key="confirm"
                            color="primary"
                            onClick={this.handleApply}
                        >
                            {"Apply"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </MLWrapper>
        );
    }
}


export default injectIntl(withStyles(styles, {withTheme: true})(FilterDialog));
