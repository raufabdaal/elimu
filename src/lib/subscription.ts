import { CloudSubscription, getTrialDaysLeft } from "@/lib/cloud-profile";

export type AccessState = "active" | "trialing" | "expired" | "inactive";

export function getAccessState(subscription: CloudSubscription | null): AccessState {
  if (!subscription) return "inactive";

  if (subscription.status === "active" || subscription.status === "manual_comp") {
    return "active";
  }

  if (subscription.status === "trialing") {
    const daysLeft = getTrialDaysLeft(subscription);
    return daysLeft !== null && daysLeft > 0 ? "trialing" : "expired";
  }

  if (["expired", "cancelled", "past_due"].includes(subscription.status)) {
    return "expired";
  }

  return "inactive";
}

export function canAccessLearning(subscription: CloudSubscription | null): boolean {
  const state = getAccessState(subscription);
  return state === "active" || state === "trialing";
}

export function getSubscriptionLabel(subscription: CloudSubscription | null): string {
  if (!subscription) return "No plan yet";
  const accessState = getAccessState(subscription);

  if (accessState === "active") {
    if (subscription.status === "manual_comp") return "Active access";
    return `${subscription.plan} plan active`;
  }

  if (accessState === "trialing") {
    const days = getTrialDaysLeft(subscription) || 0;
    return `Free trial · ${days} day${days === 1 ? "" : "s"} left`;
  }

  return "Trial ended";
}

export function shouldShowTrialReminder(subscription: CloudSubscription | null): boolean {
  if (!subscription || subscription.status !== "trialing") return false;
  const days = getTrialDaysLeft(subscription);
  return days !== null && days <= 5;
}
