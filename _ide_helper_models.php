<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property int $user_id
 * @property string $comment
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Comment whereUserId($value)
 */
	class Comment extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $code
 * @property int $department_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Department $department
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @method static \Database\Factories\CourseFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereDepartmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Course whereUpdatedAt($value)
 */
	class Course extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Course> $courses
 * @property-read int|null $courses_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @method static \Database\Factories\DepartmentFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Department whereUpdatedAt($value)
 */
	class Department extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string|null $roll_number
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member whereRollNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Member whereUpdatedAt($value)
 */
	class Member extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $title
 * @property string $description
 * @property string|null $benefits
 * @property string|null $body
 * @property string $content_format
 * @property string|null $cover_image_url
 * @property string|null $excerpt
 * @property string|null $academic_year
 * @property string|null $student_year
 * @property string|null $objectives
 * @property string|null $github_link
 * @property string|null $members_json
 * @property int $user_id
 * @property int|null $department_id
 * @property int|null $course_id
 * @property int|null $supervisor_id
 * @property string $approval_status
 * @property \Carbon\CarbonImmutable|null $approved_at
 * @property int|null $approved_by
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\User|null $approvedBy
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \App\Models\Course|null $course
 * @property-read \App\Models\Department|null $department
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProjectFile> $files
 * @property-read int|null $files_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Member> $members
 * @property-read int|null $members_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProjectNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Reaction> $reactions
 * @property-read int|null $reactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SavedProject> $savedByUsers
 * @property-read int|null $saved_by_users_count
 * @property-read \App\Models\User|null $supervisor
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Tag> $tags
 * @property-read int|null $tags_count
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project approved()
 * @method static \Database\Factories\ProjectFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project forSupervisor(int $supervisorId)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project pending()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereAcademicYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereApprovalStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereApprovedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereApprovedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereBenefits($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereBody($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereContentFormat($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereCourseId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereCoverImageUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDepartmentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereExcerpt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereGithubLink($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereMembersJson($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereObjectives($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereStudentYear($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereSupervisorId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Project whereUserId($value)
 */
	class Project extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property string $file_path
 * @property string|null $original_name
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Project $project
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile whereFilePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile whereOriginalName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectFile whereUpdatedAt($value)
 */
	class ProjectFile extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $recipient_user_id
 * @property string $message
 * @property int $project_id
 * @property int|null $comment_id
 * @property string $notification_type
 * @property string|null $project_title
 * @property string|null $comment_text
 * @property string|null $commenter_name
 * @property string|null $approver_name
 * @property string|null $rejection_reason
 * @property bool $is_read
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Comment|null $comment
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\User $recipient
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereApproverName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereCommentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereCommentText($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereCommenterName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereIsRead($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereMessage($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereNotificationType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereProjectTitle($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereRecipientUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereRejectionReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|ProjectNotification whereUpdatedAt($value)
 */
	class ProjectNotification extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property int $user_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Reaction whereUserId($value)
 */
	class Reaction extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property int $user_id
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SavedProject whereUserId($value)
 */
	class SavedProject extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Tag whereUpdatedAt($value)
 */
	class Tag extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Carbon\CarbonImmutable|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property \Carbon\CarbonImmutable|null $two_factor_confirmed_at
 * @property string|null $avatar_url
 * @property string|null $bio
 * @property string $role
 * @property bool $is_active
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Comment> $comments
 * @property-read int|null $comments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ProjectNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Reaction> $reactions
 * @property-read int|null $reactions_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SavedProject> $savedProjects
 * @property-read int|null $saved_projects_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $supervisedProjects
 * @property-read int|null $supervised_projects_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereAvatarUrl($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereBio($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorConfirmedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorRecoveryCodes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereTwoFactorSecret($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 */
	class User extends \Eloquent implements \Illuminate\Contracts\Auth\MustVerifyEmail {}
}

