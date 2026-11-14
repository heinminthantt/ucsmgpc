import projects from './projects'
import departments from './departments'
import courses from './courses'
import users from './users'
import me from './me'

const api = {
    projects: Object.assign(projects, projects),
    departments: Object.assign(departments, departments),
    courses: Object.assign(courses, courses),
    users: Object.assign(users, users),
    me: Object.assign(me, me),
}

export default api