import React, {Component} from "react";

import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {injectIntl} from "react-intl";
import {withStyles} from "@material-ui/core/styles";
import yellow from "@material-ui/core/colors/yellow";

const styles = () => ({
    avatar: {
        color: "#fff",
        backgroundColor: yellow[800],
    },
    details: {
        height: "670px",
        padding: "20px",
        background: "light-yellow",
        transition: "all 0.5s ease-in"
    },
    detailHeader: {
        display: "flex"
    },
    detailHeaderText: {
        marginTop: "5px",
        marginLeft: "15px"
    }
});

class ResultAttributes extends Component {

    static propTypes = {
        connection: PropTypes.object,
        onChange: PropTypes.func,
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.handleNameChange = :: this.handleNameChange;
        this.handleHypothesisChange = :: this.handleHypothesisChange;
        this.handleRisksChange = :: this.handleRisksChange;
        this.handleAssumptionsChange = :: this.handleAssumptionsChange;

        this.state = {
            connection: props.connection
        };
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        this.setState({connection: newProps.connection});
    }

    handleNameChange(newValue) {
        const {connection} = this.state;
        connection.label = newValue.target.value;
        this.setState({connection}, this.props.onChange);
    }

    handleHypothesisChange(newValue) {
        const {connection} = this.state;
        connection.hypothesis = newValue.target.value;
        this.setState({connection});
    }

    handleRisksChange(newValue) {
        const {connection} = this.state;
        connection.risks = newValue.target.value;
        this.setState({connection});
    }

    handleAssumptionsChange(newValue) {
        const {connection} = this.state;
        connection.assumptions = newValue.target.value;
        this.setState({connection});
    }

    render() {

        const {classes} = this.props;

        const {connection} = this.state;

        return (

            <div>

                <Paper
                    className={classes.details + " fade-in"}
                    elevation={4}
                >

                    <div className={classes.detailHeader}>

                        <Avatar className={classes.avatar}>{"C"}</Avatar>

                        <Typography
                            className={classes.detailHeaderText}
                            variant="h5"
                        >
                            {"Connection Details"}
                        </Typography>

                    </div>

                    <div>
                        <TextField
                            label="Label"
                            value={connection.label ? connection.label : ""}
                            onChange={this.handleNameChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Hypothesis"
                            multiline
                            rows={6}
                            rowsMax={6}
                            value={connection.hypothesis ? connection.hypothesis : ""}
                            onChange={this.handleHypothesisChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Risks"
                            multiline
                            rows={6}
                            rowsMax={6}
                            value={connection.risks ? connection.risks : ""}
                            onChange={this.handleRisksChange}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="Assumptions"
                            multiline
                            rows={6}
                            rowsMax={6}
                            value={connection.assumptions ? connection.assumptions : ""}
                            onChange={this.handleAssumptionsChange}
                            fullWidth
                            margin="normal"
                        />

                    </div>

                </Paper>
            </div>
        );
    }
}

export default injectIntl(withStyles(styles, {withTheme: true})(ResultAttributes));
