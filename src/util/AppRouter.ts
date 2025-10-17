export declare const appRouter: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<
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
    errorShape: {
      message: string;
      data: {
        stack: null;
        zodError: import("zod").typeToFlattenedError<any, string> | null;
        code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
        httpStatus: number;
        path?: string;
      };
      code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: false;
  },
  import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
    user: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<
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
        errorShape: {
          message: string;
          data: {
            stack: null;
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
          };
          code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: false;
      },
      import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
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
    auth: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<
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
        errorShape: {
          message: string;
          data: {
            stack: null;
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
          };
          code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: false;
      },
      import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
        login: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            password: string;
            email: string;
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
            password: string;
            username: string;
            email: string;
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
    notes: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<
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
        errorShape: {
          message: string;
          data: {
            stack: null;
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
          };
          code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: false;
      },
      import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
        syncNotes: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            clientNotes: {
              id: string;
              uuid: string;
              type: string;
              key: string;
              dateModified: number;
              dateLastSynced: number;
            }[];
            guestNotes: {
              id: string;
              uuid: string;
              type: string;
              key: string;
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
            type: string;
            key: string;
            dateModified: number;
            dateCreated: number;
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
    password: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<
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
        errorShape: {
          message: string;
          data: {
            stack: null;
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
          };
          code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: false;
      },
      import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
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
            newPassword: string;
            oldPassword: string;
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
    admin: import("@trpc/server/unstable-core-do-not-import").BuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            username: string;
            email: string;
          } | null;
        };
        meta: object;
        errorShape: {
          message: string;
          data: {
            stack: null;
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_KEY;
            httpStatus: number;
            path?: string;
          };
          code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: false;
      },
      import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<{
        getAnalytics: import("@trpc/server").TRPCQueryProcedure<{
          input: {
            userId?: number | undefined;
            action?: string | undefined;
            limit?: number | undefined;
            offset?: number | undefined;
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
