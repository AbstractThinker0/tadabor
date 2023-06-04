export interface chapterProps {
  id: number;
  name: string;
  transliteration: string;
}

export type verseProps = {
  key: string;
  suraid: string;
  verseid: string;
  versetext: string;
};

export interface RankedVerseProps {
  key: string;
  suraid: string;
  verseid: string;
  versetext: string;
  rank: number;
}

export interface translationsProps {
  [key: string]: verseProps[];
}

export interface quranProps {
  id: number;
  verses: verseProps[];
}

export interface rootProps {
  id: number;
  name: string;
  count: string;
  occurences: string[];
}

export interface selectedChaptersType {
  [key: string]: boolean;
}

export interface notesType {
  [key: string]: string;
}

export interface notesDirectionType {
  [key: string]: string;
}

export interface markedNotesType {
  [key: string]: boolean;
}

export interface NoteProp {
  text: string;
  dir: string;
}

export interface UserNotesType {
  [key: string]: NoteProp;
}

export interface translationsType {
  [key: string]: string;
}

// Bellow snippets are thanks to this article https://patrickdesjardins.com/blog/typescript-with-strong-typed-action-when-using-usereducer-of-react-hooks

/**
 * Create an action that has a strongly typed string literal name with a strongly typed payload
 */
export function createActionPayload<TypeAction, TypePayload>(
  actionType: TypeAction
): (payload: TypePayload) => ActionsWithPayload<TypeAction, TypePayload> {
  return (p: TypePayload): ActionsWithPayload<TypeAction, TypePayload> => {
    return {
      payload: p,
      type: actionType,
    };
  };
}

/**
 * Create an action with no payload
 */
export function createAction<TypeAction>(
  actionType: TypeAction
): () => ActionsWithoutPayload<TypeAction> {
  return (): ActionsWithoutPayload<TypeAction> => {
    return {
      type: actionType,
    };
  };
}
/**
 * Create an action with a payload
 */
export interface ActionsWithPayload<TypeAction, TypePayload> {
  type: TypeAction;
  payload: TypePayload;
}

/**
 * Create an action that does not have a payload
 */
export interface ActionsWithoutPayload<TypeAction> {
  type: TypeAction;
}

/**
 * A very general type that means to be "an object with a many field created with createActionPayload and createAction
 */
interface ActionCreatorsMapObject {
  [key: string]: (
    ...args: any[]
  ) => ActionsWithPayload<any, any> | ActionsWithoutPayload<any>;
}

/**
 * Use this Type to merge several action object that has field created with createActionPayload or createAction
 * E.g. type ReducerWithActionFromTwoObjects = ActionsUnion<typeof ActionsObject1 & typeof ActionsObject2>;
 */
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>;
