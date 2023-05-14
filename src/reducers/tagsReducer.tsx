import {
  TAGS_ACTIONS,
  tagProps,
  tagsActionsProps,
  tagsStateProps,
} from "../components/Tags/consts";

function tagsReducer(
  state: tagsStateProps,
  action: tagsActionsProps
): tagsStateProps {
  switch (action.type) {
    case TAGS_ACTIONS.SET_CHAPTER: {
      return { ...state, scrollKey: "", currentChapter: action.payload };
    }
    case TAGS_ACTIONS.SET_SELECTED_CHAPTERS: {
      return { ...state, selectedChapters: action.payload };
    }
    case TAGS_ACTIONS.TOGGLE_SELECT_CHAPTER: {
      const newSelectChapters = { ...state.selectedChapters };
      newSelectChapters[action.payload] = !newSelectChapters[action.payload];
      return { ...state, selectedChapters: newSelectChapters };
    }
    case TAGS_ACTIONS.ADD_TAG: {
      const newTag: tagProps = action.payload;

      return {
        ...state,
        tags: {
          ...state.tags,
          [newTag.tagID]: { ...newTag },
        },
      };
    }
    case TAGS_ACTIONS.SET_TAGS: {
      return { ...state, tags: action.payload };
    }
    case TAGS_ACTIONS.SET_CURRENT_TAG: {
      return { ...state, currentTag: action.payload };
    }
    case TAGS_ACTIONS.DELETE_TAG: {
      const newTags = { ...state.tags };

      delete newTags[action.payload];

      const newVersesTags = { ...state.versesTags };

      for (const verseKey in newVersesTags) {
        const verseTags = newVersesTags[verseKey];
        newVersesTags[verseKey] = verseTags.filter(
          (tag) => tag !== action.payload
        );
      }

      const selectedTags = { ...state.selectedTags };
      delete selectedTags[action.payload];

      return {
        ...state,
        tags: newTags,
        versesTags: newVersesTags,
        selectedTags: selectedTags,
      };
    }
    case TAGS_ACTIONS.SET_CURRENT_VERSE: {
      return { ...state, currentVerse: action.payload };
    }
    case TAGS_ACTIONS.SET_VERSE_TAGS: {
      let versesTags = { ...state.versesTags };

      if (action.payload.tags === null) {
        delete versesTags[action.payload.verseKey];
      } else {
        versesTags = {
          ...versesTags,
          [action.payload.verseKey]: action.payload.tags,
        };
      }

      return { ...state, versesTags };
    }
    case TAGS_ACTIONS.SET_VERSES_TAGS: {
      return { ...state, versesTags: { ...action.payload } };
    }
    case TAGS_ACTIONS.SELECT_TAG: {
      return {
        ...state,
        scrollKey: "",
        selectedTags: {
          ...state.selectedTags,
          [action.payload.tagID]: action.payload,
        },
      };
    }
    case TAGS_ACTIONS.DESELECT_TAG: {
      const selectedTags = { ...state.selectedTags };
      delete selectedTags[action.payload];
      return { ...state, selectedTags: selectedTags };
    }
    case TAGS_ACTIONS.GOTO_CHAPTER: {
      return {
        ...state,
        selectedTags: {},
        currentChapter: Number(action.payload),
      };
    }
    case TAGS_ACTIONS.SET_SCROLL_KEY: {
      const newKey = state.scrollKey === action.payload ? "" : action.payload;
      return { ...state, scrollKey: newKey };
    }
  }
}

export default tagsReducer;
