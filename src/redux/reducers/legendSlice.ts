import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const colorThemes: Record<string, string[]> = {
    // last color is text color
    green: ['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'text-green-600'],
    red: ['bg-gray-100', 'bg-red-200', 'bg-red-400', 'bg-red-600', 'text-red-600'],
    blue: ['bg-gray-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'text-blue-600'],
    purple: ['bg-gray-100', 'bg-purple-200', 'bg-purple-400', 'bg-purple-600', 'text-purple-600'],
    brown: ['bg-gray-100', 'bg-yellow-700', 'bg-yellow-900', 'bg-orange-900', 'text-orange-600'],
};

interface LegendState {
    currentTheme: string;
    legendColors: string[];
}

const initialState: LegendState = {
    currentTheme: 'green',
    legendColors: colorThemes.green,
};

const legendSlice = createSlice({
    name: 'legend',
    initialState,
    reducers: {
        setLegendTheme: (state, action: PayloadAction<string>) => {
            const theme = action.payload;
            state.currentTheme = theme;
            state.legendColors = colorThemes[theme] || state.legendColors;
        },
    },
});

export const { setLegendTheme } = legendSlice.actions;
export const legendReducer = legendSlice.reducer;
export { colorThemes };
