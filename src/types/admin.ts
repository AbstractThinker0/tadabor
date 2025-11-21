import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@/util/AppRouter";

export type AnalyticsResponse = inferProcedureOutput<
    AppRouter["admin"]["getAnalytics"]
>;
export type AnalyticsData = AnalyticsResponse["data"][number];

export type ActionStatsResponse = inferProcedureOutput<
    AppRouter["admin"]["getActionStats"]
>;
export type ActionStatsData = ActionStatsResponse[number];

export type UserStatsResponse = inferProcedureOutput<
    AppRouter["admin"]["getUserStats"]
>;
export type UserStatsData = UserStatsResponse[number];

export type UsersResponse = inferProcedureOutput<
    AppRouter["admin"]["listUsers"]
>;
export type UserData = UsersResponse["data"][number];

export type UpdateUserResponse = inferProcedureOutput<
    AppRouter["admin"]["updateUser"]
>;

export type DeleteUserResponse = inferProcedureOutput<
    AppRouter["admin"]["deleteUser"]
>;
