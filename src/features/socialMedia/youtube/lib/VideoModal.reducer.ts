import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface VideoModalStore {
    open: boolean;
    query: string;
}

export const initialState: VideoModalStore = {
    open: false,
    query: "",
};

export const videoModalSlice = createSlice({
    name: "VideoModal",
    initialState,
    reducers: {
        toggleOpen: (state) => {
            state.open = !state.open;
        },
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
    },
});

export const {toggleOpen, setQuery} = videoModalSlice.actions;
export default videoModalSlice.reducer;
