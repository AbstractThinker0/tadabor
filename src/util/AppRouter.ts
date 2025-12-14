export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<
  {
    ctx: {
      user: {
        id: number;
        username: string;
        email: string;
      } | null;
      clientVersion: string | undefined;
    };
    meta: object;
    errorShape: import("@trpc/server").TRPCDefaultErrorShape;
    transformer: false;
  },
  import("@trpc/server").TRPCDecorateCreateRouterOptions<{
    user: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            username: string;
            email: string;
          } | null;
          clientVersion: string | undefined;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
      },
      import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getUser: import("@trpc/server").TRPCQueryProcedure<{
          input: {
            username: string;
          };
          output: {
            user: {
              id: number;
              username: string;
              email: string;
              role: number;
            };
          };
        }>;
        getProfile: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            email: string;
            username: string;
          };
        }>;
      }>
    >;
    auth: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            username: string;
            email: string;
          } | null;
          clientVersion: string | undefined;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
      },
      import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        login: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            email: string;
            password: string;
          };
          output: {
            success: boolean;
            message: string;
            token: string;
            user: {
              id: number;
              username: string;
              email: string;
              role: number;
            };
          };
        }>;
        signUp: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            username: string;
            email: string;
            password: string;
            captchaToken: string;
          };
          output:
            | {
                success: boolean;
                message: string;
                token: string;
                userid?: undefined;
              }
            | {
                success: boolean;
                message: string;
                userid: number;
                token: string;
              };
        }>;
        refresh: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            success: boolean;
            user: {
              id: number;
              username: string;
              email: string;
              role: number;
            };
            message: string;
            newToken: string;
          };
        }>;
        updateEmailOrUsername: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            username: string;
            email: string;
          };
          output: {
            success: boolean;
            message: string;
          };
        }>;
      }>
    >;
    notes: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            username: string;
            email: string;
          } | null;
          clientVersion: string | undefined;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
      },
      import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        syncNotes: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            clientNotes: {
              id: string;
              uuid: string;
              key: string;
              type: string;
              dateModified: number;
              dateLastSynced: number;
            }[];
            guestNotes: {
              id: string;
              uuid: string;
              key: string;
              type: string;
              dateModified: number;
              dateLastSynced: number;
            }[];
          };
          output: {
            notesToSendToClient: string[];
            notesToRequestFromClient: string[];
            notesToRequestFromGuest: string[];
          };
        }>;
        getNotesIndexes: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: Map<
            string,
            {
              id: string;
              uuid: string;
              key: string;
              type: string;
              dateModified: number;
            }
          >;
        }>;
        uploadNote: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            uuid: string;
            key: string;
            type: string;
            dateCreated: number;
            dateModified: number;
            content?: string | null | undefined;
            direction?: string | null | undefined;
          };
          output:
            | {
                success: boolean;
                note: {
                  uuid: string;
                  key: string;
                  dateLastSynced: number;
                };
              }
            | undefined;
        }>;
        fetchNote: import("@trpc/server").TRPCQueryProcedure<{
          input: {
            id: string;
          };
          output: {
            note: {
              id: string;
              uuid: string;
              type: string;
              noteId: number;
              authorId: number;
              key: string;
              content: string | null;
              direction: string | null;
              dateModified: number;
              dateCreated: number;
              dateLastSynced: number;
              isDeleted: boolean | null;
              isPublished: boolean | null;
            };
            success: boolean;
          };
        }>;
      }>
    >;
    password: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            username: string;
            email: string;
          } | null;
          clientVersion: string | undefined;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
      },
      import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        requestPasswordReset: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            email: string;
          };
          output: {
            success: boolean;
            message: string;
          };
        }>;
        resetPassword: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            token: string;
            newPassword: string;
          };
          output: {
            success: boolean;
            message: string;
            token: string;
            user: {
              id: number;
              username: string;
              email: string;
              role: number;
            };
          };
        }>;
        updatePassword: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            oldPassword: string;
            newPassword: string;
          };
          output: {
            success: boolean;
            message: string;
            token: string;
            user: {
              id: number;
              username: string;
              email: string;
              role: number;
            };
          };
        }>;
      }>
    >;
    admin: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            username: string;
            email: string;
          } | null;
        };
        meta: object;
        errorShape: import("@trpc/server").TRPCDefaultErrorShape;
        transformer: false;
      },
      import("@trpc/server").TRPCDecorateCreateRouterOptions<{
        getAnalytics: import("@trpc/server").TRPCQueryProcedure<{
          input: {
            limit?: number | undefined;
            offset?: number | undefined;
            action?: string | undefined;
            userId?: number | undefined;
            startDate?: number | undefined;
            endDate?: number | undefined;
          };
          output: {
            data: {
              id: number;
              userId: number;
              action: string;
              oldData: string | null;
              newData: string | null;
              timestamp: number;
              ipAddress: string | null;
              userAgent: string | null;
              username: string | null;
              email: string | null;
            }[];
            meta: {
              total: number;
              limit: number;
              offset: number;
            };
          };
        }>;
        getActionStats: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            action: string;
            count: unknown;
          }[];
        }>;
        getUserStats: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            userId: number;
            username: string | null;
            count: unknown;
          }[];
        }>;
        listUsers: import("@trpc/server").TRPCQueryProcedure<{
          input: {
            limit?: number | undefined;
            offset?: number | undefined;
          };
          output: {
            data: {
              id: number;
              uuid: string;
              username: string;
              email: string;
              role: number;
            }[];
            meta: {
              total: number;
              limit: number;
              offset: number;
            };
          };
        }>;
        updateUser: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            id: number;
            username?: string | undefined;
            email?: string | undefined;
            role?: number | undefined;
          };
          output: {
            id: number;
            uuid: string;
            username: string;
            email: string;
            role: number;
          };
        }>;
        deleteUser: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            id: number;
          };
          output: {
            success: boolean;
            message: string;
          };
        }>;
      }>
    >;
  }>
>;
export type AppRouter = typeof appRouter;

import type { inferProcedureOutput } from "@trpc/server";
// Extract the note type from the fetchNote procedure output
export type BackendNote = inferProcedureOutput<
  AppRouter["notes"]["fetchNote"]
>["note"];
