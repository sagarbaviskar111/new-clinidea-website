// Scalable Role & Permission System Architecture for Clinidea Education

export const ROLES = {
  ADMIN: 'ADMIN',
  MENTOR: 'MENTOR',
  STUDENT: 'STUDENT',
  STUDENT_COORDINATOR: 'STUDENT_COORDINATOR'
};

export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  
  STUDENTS_VIEW: 'students.view',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_EDIT: 'students.edit',
  STUDENTS_DELETE: 'students.delete',

  LEADS_VIEW: 'leads.view',
  LEADS_CREATE: 'leads.create',
  LEADS_EDIT: 'leads.edit',
  LEADS_ASSIGN: 'leads.assign',

  SESSIONS_VIEW: 'sessions.view',
  SESSIONS_CREATE: 'sessions.create',
  SESSIONS_EDIT: 'sessions.edit',
  SESSIONS_DELETE: 'sessions.delete',

  RECORDINGS_UPLOAD: 'recordings.upload',
  MATERIALS_UPLOAD: 'materials.upload',
  QUESTIONBANK_UPLOAD: 'questionbank.upload',

  EXAM_CREATE: 'exam.create',
  EXAM_EDIT: 'exam.edit',
  EXAM_DELETE: 'exam.delete',
  EXAM_RESULTS: 'exam.results',

  ASSIGNMENT_CREATE: 'assignment.create',
  ASSIGNMENT_GRADE: 'assignment.grade',

  ATTENDANCE_MANAGE: 'attendance.manage',

  FEES_VIEW: 'fees.view',
  FEES_MANAGE: 'fees.manage',

  CERTIFICATES_MANAGE: 'certificates.manage',
  REPORTS_VIEW: 'reports.view',
  WEBSITE_MANAGE: 'website.manage',
  MENTOR_MANAGE: 'mentor.manage',
  COORDINATOR_MANAGE: 'coordinator.manage'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.MENTOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SESSIONS_VIEW,
    PERMISSIONS.SESSIONS_CREATE,
    PERMISSIONS.SESSIONS_EDIT,
    PERMISSIONS.SESSIONS_DELETE,
    PERMISSIONS.RECORDINGS_UPLOAD,
    PERMISSIONS.MATERIALS_UPLOAD,
    PERMISSIONS.QUESTIONBANK_UPLOAD,
    PERMISSIONS.EXAM_CREATE,
    PERMISSIONS.EXAM_EDIT,
    PERMISSIONS.EXAM_DELETE,
    PERMISSIONS.EXAM_RESULTS,
    PERMISSIONS.ASSIGNMENT_CREATE,
    PERMISSIONS.ASSIGNMENT_GRADE,
    PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.STUDENTS_VIEW
  ],

  [ROLES.STUDENT]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.SESSIONS_VIEW,
    PERMISSIONS.EXAM_RESULTS,
    PERMISSIONS.FEES_VIEW
  ],

  [ROLES.STUDENT_COORDINATOR]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    PERMISSIONS.LEADS_EDIT,
    PERMISSIONS.LEADS_ASSIGN
  ]
};

export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  const normalizedRole = userRole.toUpperCase();
  if (normalizedRole === ROLES.ADMIN || normalizedRole === 'SUPERADMIN') return true;
  const permissions = ROLE_PERMISSIONS[normalizedRole] || [];
  return permissions.includes(permission);
};
