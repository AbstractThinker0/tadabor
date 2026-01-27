export declare const appRouter: import("@trpc/server").TRPCBuiltRouter<
  {
    ctx: {
      user: {
        id: number;
        uuid: string;
        username: string;
        email: string;
        password: string;
        role: number;
        description: string | null;
        avatarSeed: string | null;
      } | null;
      clientVersion: string | undefined;
      ipAddress: string;
      userAgent: string;
      newToken: string;
      currentTokenId: number | null;
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
            uuid: string;
            username: string;
            email: string;
            password: string;
            role: number;
            description: string | null;
            avatarSeed: string | null;
          } | null;
          clientVersion: string | undefined;
          ipAddress: string;
          userAgent: string;
          newToken: string;
          currentTokenId: number | null;
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
              description: string | null;
              avatarSeed: string | null;
            };
          };
          meta: object;
        }>;
        getProfile: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            email: string;
            username: string;
            description: string | null;
            avatarSeed: string | null;
          };
          meta: object;
        }>;
        updateProfileMeta: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            description?: string | null | undefined;
            avatarSeed?: string | null | undefined;
          };
          output: {
            success: boolean;
            message: string;
          };
          meta: object;
        }>;
        getConnectedDevices: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            devices: {
              id: number;
              browser: string;
              os: string;
              deviceType: string;
              ipAddress: string;
              loginTime: number;
              isCurrent: boolean;
            }[];
          };
          meta: object;
        }>;
        revokeDevice: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            tokenId: number;
          };
          output: {
            success: boolean;
            message: string;
          };
          meta: object;
        }>;
      }>
    >;
    auth: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            uuid: string;
            username: string;
            email: string;
            password: string;
            role: number;
            description: string | null;
            avatarSeed: string | null;
          } | null;
          clientVersion: string | undefined;
          ipAddress: string;
          userAgent: string;
          newToken: string;
          currentTokenId: number | null;
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
              description: string | null;
              avatarSeed: string | null;
            };
          };
          meta: object;
        }>;
        signUp: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            username: string;
            email: string;
            password: string;
            captchaToken: string;
          };
          output: {
            success: boolean;
            message: string;
            userid: number;
            token: string;
          };
          meta: object;
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
              description: string | null;
              avatarSeed: string | null;
            };
            message: string;
            newToken: string;
          };
          meta: object;
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
          meta: object;
        }>;
      }>
    >;
    notes: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            uuid: string;
            username: string;
            email: string;
            password: string;
            role: number;
            description: string | null;
            avatarSeed: string | null;
          } | null;
          clientVersion: string | undefined;
          ipAddress: string;
          userAgent: string;
          newToken: string;
          currentTokenId: number | null;
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
          meta: object;
        }>;
        getNotesIndexes: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            [k: string]: {
              id: string;
              uuid: string;
              key: string;
              type: string;
              dateModified: number;
            };
          };
          meta: object;
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
          output: {
            success: boolean;
            note: {
              uuid: string;
              key: string;
              dateLastSynced: number;
            };
          };
          meta: object;
        }>;
        fetchNote: import("@trpc/server").TRPCQueryProcedure<{
          input: {
            id: string;
          };
          output: {
            note: {
              id: string;
              uuid: string;
              noteId: number;
              authorId: number;
              key: string;
              type: string;
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
          meta: object;
        }>;
      }>
    >;
    password: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            uuid: string;
            username: string;
            email: string;
            password: string;
            role: number;
            description: string | null;
            avatarSeed: string | null;
          } | null;
          clientVersion: string | undefined;
          ipAddress: string;
          userAgent: string;
          newToken: string;
          currentTokenId: number | null;
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
          meta: object;
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
              description: string | null;
              avatarSeed: string | null;
            };
          };
          meta: object;
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
              description: string | null;
              avatarSeed: string | null;
            };
          };
          meta: object;
        }>;
      }>
    >;
    admin: import("@trpc/server").TRPCBuiltRouter<
      {
        ctx: {
          user: {
            id: number;
            uuid: string;
            username: string;
            email: string;
            password: string;
            role: number;
            description: string | null;
            avatarSeed: string | null;
          } | null;
          clientVersion: string | undefined;
          ipAddress: string;
          userAgent: string;
          newToken: string;
          currentTokenId: number | null;
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
          meta: object;
        }>;
        getActionStats: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            action: string;
            count: unknown;
          }[];
          meta: object;
        }>;
        getUserStats: import("@trpc/server").TRPCQueryProcedure<{
          input: void;
          output: {
            userId: number;
            username: string | null;
            count: unknown;
          }[];
          meta: object;
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
          meta: object;
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
          meta: object;
        }>;
        deleteUser: import("@trpc/server").TRPCMutationProcedure<{
          input: {
            id: number;
          };
          output: {
            success: boolean;
            message: string;
          };
          meta: object;
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
