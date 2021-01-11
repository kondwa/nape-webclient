export const HOME = "/";
export const ANON = "/e/:token";
export const LEAVE_SURVEY = "/leave_survey";

export const DASHBOARD = "/dashboard";
export const ERRORS = "/errors";
export const SURVEY_RUNNER = "/surveyRunner";
export const UNITS = "/units";
export const USERS = "/users";
export const TEMPLATES = "/templates";

export const PROJECT_LIST = "/projects";
export const PROJECT = "/projects/:projectId";

export const DATA_COLLECTION = PROJECT + "/collection";
export const DOCUMENT_LIST = PROJECT + "/documents";
export const DOCUMENT = DOCUMENT_LIST + "/:id";
export const EVALUATION = PROJECT + "/evaluations/:evaluationId";
export const INDICATORS = PROJECT + "/indicators";
export const INDICATOR = PROJECT + "/indicators/:indicatorId";
export const PROJECT_DASHBOARD = PROJECT + "/dashboard";
export const RESULT_MODEL_LIST = PROJECT + "/resultModels";
export const RESULT_MODEL = RESULT_MODEL_LIST + "/:resultModelId";
export const SURVEY_LIST = DATA_COLLECTION + "/surveys";
export const SURVEY_INSTANCE_LIST = SURVEY_LIST + "/:surveyGid/instances";

export const project = (projectId) => {
    const projectKey = projectId ? projectId : window.location.href.split("/")[4];
    return PROJECT_LIST + "/" + projectKey;
};

export const projectDashboard = (projectId) => {
    return project(projectId) + "/dashboard";
};

export const dataCollection = (projectId) => {
    return project(projectId) + "/collection";
};

export const documents = (projectId) => {
    return project(projectId) + "/documents";
};

export const document = (documentId, projectId) => {
    return documents(projectId) + "/" + documentId;
};

export const indicators = (projectId) => {
    return project(projectId) + "/indicators";
};

export const indicator = (indicatorId, projectId) => {
    return indicators(projectId) + "/" + indicatorId;
};

export const resultModels = (projectId) => {
    return project(projectId) + "/resultModels";
};

export const resultModel = (resultModelId, projectId) => {
    return resultModels(projectId) + "/" + resultModelId;
};

export const surveys = (projectId) => {
    return dataCollection(projectId) + "/surveys";
};

export const survey = (surveyGid, projectId) => {
    return surveys(projectId) + "/" + surveyGid;
};

export const surveyInstances = (surveyGid, projectId) => {
    return survey(surveyGid, projectId) + "/instances";
};

export const evaluations = (projectId) => {
    return project(projectId) + "/evaluations";
};

export const evaluation = (evaluationId, projectId) => {
    return evaluations(projectId) + "/" + evaluationId;
};

export const DEFAULT_LOGGED_IN = HOME;
export const DEFAULT_ANONYMOUS = HOME;
export const DEFAULT_ADMIN = DASHBOARD;
