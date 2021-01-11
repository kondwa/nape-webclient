import DataCollectionList from "../component/view/dataCollection/DataCollectionList";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

const mapStateToProps = () => {
    return {
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(DataCollectionList);
