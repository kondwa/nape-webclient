import {
    PROJECT_LIST,
    loadProjectList
} from "../services/units";

import ProjectList from "../component/view/project/ProjectList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = (state) => {
    return {
        [PROJECT_LIST]: state.units[PROJECT_LIST]
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        loadProjectList
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
