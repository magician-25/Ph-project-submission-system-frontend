function ProfileField({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className="break-all text-sm font-medium">{value}</p>
        </div>
    );
}

export default ProfileField