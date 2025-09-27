import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Async thunk to load messages for a specific locale
export const loadMessages = createAsyncThunk(
  "language/loadMessages",
  async (locale) => {
    try {
      const messages = await import(`../../messages/${locale}.json`);
      return { locale, messages: messages.default };
    } catch (error) {
      console.error(`Failed to load messages for locale: ${locale}`, error);
      throw error;
    }
  }
);

const languageSlice = createSlice({
  name: "language",
  initialState: {
    currentLocale: "en",
    messages: {},
    allMessages: {},
    loading: false,
    error: null,
  },
  reducers: {
    setLocale: (state, action) => {
      state.currentLocale = action.payload;
      // Update document language attribute
      if (typeof document !== "undefined") {
        document.documentElement.lang = action.payload;
      }
      // Store preference in localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("preferred-locale", action.payload);
      }
    },
    setMessages: (state, action) => {
      const { locale, messages } = action.payload;
      state.messages = messages;
      state.allMessages[locale] = messages;
    },
    initializeLanguage: (state, action) => {
      const { locale, messages } = action.payload;
      state.currentLocale = locale;
      state.messages = messages;
      state.allMessages[locale] = messages;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        const { locale, messages } = action.payload;
        console.log("languageSlice - loadMessages.fulfilled:", {
          locale,
          hasMessages: !!messages,
          hasClient: !!messages.client,
          hasProfilePrivate: !!messages.client?.profilePrivate,
          profilePrivateKeys: messages.client?.profilePrivate
            ? Object.keys(messages.client.profilePrivate)
            : "N/A",
        });

        state.loading = false;
        state.messages = messages;
        state.allMessages[locale] = messages;
        state.currentLocale = locale;

        console.log("languageSlice - State updated:", {
          currentMessages: state.messages,
          hasClient: !!state.messages.client,
          hasProfilePrivate: !!state.messages.client?.profilePrivate,
        });

        // Update document language attribute
        if (typeof document !== "undefined") {
          document.documentElement.lang = locale;
        }
        // Store preference in localStorage
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("preferred-locale", locale);
        }
      })
      .addCase(loadMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const currentLanguage = "EN"

export const { setLocale, setMessages, initializeLanguage } =
  languageSlice.actions;
export default languageSlice.reducer;
