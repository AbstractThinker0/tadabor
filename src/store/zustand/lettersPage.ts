import { create } from "zustand";
import { combine } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {
    LettersDefinitionType,
    LettersDataByVerseType,
    LettersPresetsType,
} from "@/types";
import type { LetterRoleType } from "@/util/consts";
import type { ILetterData } from "@/types/db";

import { dbLetters } from "@/util/dbFuncs";
import { tryCatch } from "@/util/trycatch";

interface LettersPageState {
    currentChapter: string;
    currentPreset: string;
    scrollKey: string;
    tabIndex: string;
    lettersDefinitions: LettersDefinitionType;
    definitionsLoading: boolean;
    definitionsComplete: boolean;
    definitionsError: boolean;
    letterPresets: LettersPresetsType;
    presetsLoading: boolean;
    presetsComplete: boolean;
    presetsError: boolean;
    lettersData: LettersDataByVerseType;
    dataLoading: boolean;
    dataComplete: boolean;
    dataError: boolean;
    showSearchPanel: boolean;
    showSearchPanelMobile: boolean;
}

const initialState: LettersPageState = {
    currentChapter: "1",
    currentPreset: "-1",
    scrollKey: "",
    tabIndex: "defTab",
    lettersDefinitions: {},
    definitionsLoading: true,
    definitionsComplete: false,
    definitionsError: false,
    letterPresets: {},
    presetsLoading: true,
    presetsComplete: false,
    presetsError: false,
    lettersData: {},
    dataLoading: true,
    dataComplete: false,
    dataError: false,
    showSearchPanel: true,
    showSearchPanelMobile: false,
};

export const useLettersPageStore = create(
    immer(
        combine(initialState, (set, get) => ({
            // Async action: Initialize letter definitions from Dexie
            initializeDefinitions: async () => {
                const { definitionsComplete, definitionsLoading } = get();
                if (definitionsComplete) return;
                if (definitionsLoading === false) {
                    set((state) => {
                        state.definitionsLoading = true;
                        state.definitionsError = false;
                    });
                }

                const { result: dbData, error } = await tryCatch(
                    dbLetters.loadDefinitions()
                );

                if (error) {
                    console.error("Failed to load letter definitions:", error);
                    set((state) => {
                        state.definitionsLoading = false;
                        state.definitionsError = true;
                    });
                    return;
                }

                const notesData: LettersDefinitionType = {};

                dbData.forEach((letter) => {
                    const defKey =
                        letter.preset_id === "-1"
                            ? letter.name
                            : `${letter.name}:${letter.preset_id}`;

                    notesData[defKey] = {
                        name: letter.name,
                        definition: letter.definition,
                        dir: letter.dir,
                        preset_id: letter.preset_id,
                    };
                });

                set((state) => {
                    state.lettersDefinitions = notesData;
                    state.definitionsLoading = false;
                    state.definitionsComplete = true;
                });
            },

            // Async action: Initialize presets from Dexie
            initializePresets: async () => {
                const { presetsComplete, presetsLoading } = get();
                if (presetsComplete) return;
                if (presetsLoading === false) {
                    set((state) => {
                        state.presetsLoading = true;
                        state.presetsError = false;
                    });
                }

                const { result: dbData, error } = await tryCatch(
                    dbLetters.loadPresets()
                );

                if (error) {
                    console.error("Failed to load letter presets:", error);
                    set((state) => {
                        state.presetsLoading = false;
                        state.presetsError = true;
                    });
                    return;
                }

                const presetsData: LettersPresetsType = {};

                dbData.forEach((preset) => {
                    presetsData[preset.id] = preset.name;
                });

                set((state) => {
                    state.letterPresets = presetsData;
                    state.presetsLoading = false;
                    state.presetsComplete = true;
                });
            },

            // Async action: Initialize letter data from Dexie
            initializeData: async () => {
                const { dataComplete, dataLoading } = get();
                if (dataComplete) return;
                if (dataLoading === false) {
                    set((state) => {
                        state.dataLoading = true;
                        state.dataError = false;
                    });
                }

                const { result: dbData, error } = await tryCatch(dbLetters.loadData());

                if (error) {
                    console.error("Failed to load letter data:", error);
                    set((state) => {
                        state.dataLoading = false;
                        state.dataError = true;
                    });
                    return;
                }

                const notesData: LettersDataByVerseType = {};

                dbData.forEach((letter: ILetterData) => {
                    const letterInfo = letter.letter_key.split(":");
                    const verseKey = letterInfo[0];
                    const letterKey = letterInfo[1];

                    if (!notesData[verseKey]) {
                        notesData[verseKey] = {};
                    }

                    notesData[verseKey][letterKey] = {
                        letter_key: letterKey,
                        letter_role: letter.letter_role,
                        def_id: letter.def_id,
                    };
                });

                set((state) => {
                    state.lettersData = notesData;
                    state.dataLoading = false;
                    state.dataComplete = true;
                });
            },

            // Async action: Save letter definition with persistence
            saveDefinition: async (
                preset_id: string,
                name: string,
                definition: string,
                dir: string = ""
            ) => {
                const { error } = await tryCatch(
                    dbLetters.saveDefinition(preset_id, name, definition, dir)
                );

                if (error) {
                    console.error("Failed to save letter definition:", error);
                    return false;
                }

                const defKey = preset_id === "-1" ? name : `${name}:${preset_id}`;

                set((state) => {
                    state.lettersDefinitions[defKey] = {
                        name,
                        definition,
                        dir,
                        preset_id,
                    };
                });

                return true;
            },

            // Async action: Save letter data with persistence
            saveData: async ({
                letter_key,
                letter_role,
                def_id,
            }: {
                letter_key: string;
                letter_role: LetterRoleType;
                def_id: string;
            }) => {
                const { error } = await tryCatch(
                    dbLetters.saveData({ letter_key, letter_role, def_id })
                );

                if (error) {
                    console.error("Failed to save letter data:", error);
                    return false;
                }

                const letterInfo = letter_key.split(":");
                const verseKey = letterInfo[0];
                const letterKeyPart = letterInfo[1];

                set((state) => {
                    if (!state.lettersData[verseKey]) {
                        state.lettersData[verseKey] = {};
                    }

                    state.lettersData[verseKey][letterKeyPart] = {
                        letter_key: letterKeyPart,
                        letter_role,
                        def_id,
                    };
                });

                return true;
            },

            // Async action: Save preset with persistence
            savePreset: async (id: string, name: string) => {
                const { error } = await tryCatch(dbLetters.savePreset(id, name));

                if (error) {
                    console.error("Failed to save preset:", error);
                    return false;
                }

                set((state) => {
                    state.letterPresets[id] = name;
                    state.currentPreset = id;
                });

                return true;
            },

            setCurrentChapter: (chapter: string) => {
                set((state) => {
                    state.currentChapter = chapter;
                });
            },

            setCurrentPreset: (preset: string) => {
                set((state) => {
                    state.currentPreset = preset;
                });
            },

            setScrollKey: (key: string) => {
                set((state) => {
                    state.scrollKey = state.scrollKey === key ? "" : key;
                });
            },

            setTabIndex: (index: string) => {
                set((state) => {
                    state.tabIndex = index;
                });
            },

            setSearchPanel: (isOpen: boolean) => {
                set((state) => {
                    state.showSearchPanel = isOpen;
                    state.showSearchPanelMobile = isOpen;
                });
            },

            // Sync action for updating letter definition in state (used when also saving via async)
            setLetterDefinition: (payload: {
                name: string;
                definition: string;
                preset_id: string;
                dir?: string;
            }) => {
                const defKey =
                    payload.preset_id === "-1"
                        ? payload.name
                        : `${payload.name}:${payload.preset_id}`;

                set((state) => {
                    state.lettersDefinitions[defKey] = {
                        name: payload.name,
                        definition: payload.definition,
                        dir: payload.dir,
                        preset_id: payload.preset_id,
                    };
                });
            },

            // Sync action for updating letter data in state
            setLetterData: (payload: {
                letter: string;
                role: LetterRoleType;
                def_id: string;
            }) => {
                const letterInfo = payload.letter.split(":");
                const verseKey = letterInfo[0];
                const letterKey = letterInfo[1];

                set((state) => {
                    if (!state.lettersData[verseKey]) {
                        state.lettersData[verseKey] = {};
                    }

                    state.lettersData[verseKey][letterKey] = {
                        letter_key: letterKey,
                        letter_role: payload.role,
                        def_id: payload.def_id,
                    };
                });
            },

            // Sync action for adding preset to state
            setPreset: (payload: { presetID: string; presetName: string }) => {
                set((state) => {
                    state.letterPresets[payload.presetID] = payload.presetName;
                    state.currentPreset = payload.presetID;
                });
            },

            reset: () => {
                set(() => ({ ...initialState }));
            },
        }))
    )
);
