import ProfileField from "@/components/shared/ProfileField";
import type { User } from "@/types";
import { formatDate } from "@/utils";

function ProfileDetails({ user }: { user: User }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <ProfileField label="Full name" value={user.name} />
            <ProfileField label="Email address" value={user.email} />
            <ProfileField label="User ID" value={user.id} />
            <ProfileField label="Role" value={user.role.replaceAll("_", " ")} />
            <ProfileField
                label="Account status"
                value={user.user_status.replaceAll("_", " ")}
            />
            <ProfileField label="Batch" value={user.batch_id ?? "Not assigned"} />
            <ProfileField label="Member since" value={formatDate(user.created_at)} />
            <ProfileField label="Last updated" value={formatDate(user.updated_at)} />
        </div>
    );
}

export default ProfileDetails;
