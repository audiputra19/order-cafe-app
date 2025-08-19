import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DarkmodeState {
    isDark: boolean;
}

const initialState: DarkmodeState = {
    isDark: false,
} 

const DarkModeSlice = createSlice({
    name: "darkMode",
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.isDark = !state.isDark;
        },
        setDarkMode: (state, action: PayloadAction<boolean>) => {
            state.isDark = action.payload;
        }
    }
});

export const { toggleDarkMode, setDarkMode } = DarkModeSlice.actions;
export default DarkModeSlice.reducer;