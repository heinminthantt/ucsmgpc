import InviteActivationController from './InviteActivationController'
import DepartmentController from './DepartmentController'
import UserController from './UserController'
import ProjectController from './ProjectController'
import CourseController from './CourseController'
import SavedProjectController from './SavedProjectController'
import NotificationController from './NotificationController'
import SupervisorController from './SupervisorController'
import AdminController from './AdminController'
import CommentController from './CommentController'
import ReactionController from './ReactionController'
import AcademicCycleController from './AcademicCycleController'
import CohortImportController from './CohortImportController'
import TeamController from './TeamController'
import SubmissionController from './SubmissionController'
import EvaluationController from './EvaluationController'
import LogbookController from './LogbookController'
import AuditLogController from './AuditLogController'
import RubricTemplateController from './RubricTemplateController'
import Settings from './Settings'

const Controllers = {
    InviteActivationController: Object.assign(InviteActivationController, InviteActivationController),
    DepartmentController: Object.assign(DepartmentController, DepartmentController),
    UserController: Object.assign(UserController, UserController),
    ProjectController: Object.assign(ProjectController, ProjectController),
    CourseController: Object.assign(CourseController, CourseController),
    SavedProjectController: Object.assign(SavedProjectController, SavedProjectController),
    NotificationController: Object.assign(NotificationController, NotificationController),
    SupervisorController: Object.assign(SupervisorController, SupervisorController),
    AdminController: Object.assign(AdminController, AdminController),
    CommentController: Object.assign(CommentController, CommentController),
    ReactionController: Object.assign(ReactionController, ReactionController),
    AcademicCycleController: Object.assign(AcademicCycleController, AcademicCycleController),
    CohortImportController: Object.assign(CohortImportController, CohortImportController),
    TeamController: Object.assign(TeamController, TeamController),
    SubmissionController: Object.assign(SubmissionController, SubmissionController),
    EvaluationController: Object.assign(EvaluationController, EvaluationController),
    LogbookController: Object.assign(LogbookController, LogbookController),
    AuditLogController: Object.assign(AuditLogController, AuditLogController),
    RubricTemplateController: Object.assign(RubricTemplateController, RubricTemplateController),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers