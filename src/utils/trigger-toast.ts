import { toast } from "@/components/ui/toast";

export interface TriggerToastInput {
  title: string;
  description: string;
  type: "error" | "success" | "info";
}

export default function triggerToast({
  title,
  description,
  type,
}: TriggerToastInput) {
  return toast.add({
    title,
    description,
    type,
  });
}
