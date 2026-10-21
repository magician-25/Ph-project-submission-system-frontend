import { IconApiBook, IconClipboardList, IconFileText, IconUser } from "@tabler/icons-react";

const adminPrefix = '/dashboard/admin'
const studentPrefix = '/dashboard/student'
const mentorPrefix = '/dashboard/mentor'

export const adminRoutes = [
    { href: `${adminPrefix}/`, label: "Profile", icon: IconUser },
    { href: `${adminPrefix}/batches`, label: "Batches", icon: IconApiBook },
    { href: `${adminPrefix}/assignments`, label: "Assignments", icon: IconClipboardList },
    { href: `${adminPrefix}/submissions`, label: "Submissions", icon: IconFileText },
]

export const studentRoutes = [
    { href: `${studentPrefix}/`, label: "Profile", icon: IconUser },
    { href: `${studentPrefix}/assignments`, label: "Assignments", icon: IconClipboardList },
    { href: `${studentPrefix}/submissions`, label: "My submissions", icon: IconFileText },
];

export const mentorRoutes = [
    { href: `${mentorPrefix}/`, label: "Profile", icon: IconUser },
    { href: `${mentorPrefix}/assignments`, label: "Assignments", icon: IconClipboardList },
    { href: `${mentorPrefix}/submissions`, label: "My submissions", icon: IconFileText },
];