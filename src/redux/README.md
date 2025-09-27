# Redux Store Documentation

## Language System

The language system is implemented using Redux and provides internationalization (i18n) support for the application.

### Architecture

- **Language Slice** (`src/redux/features/languageSlice.js`): Manages language state, locale switching, and message loading
- **Language Provider** (`src/components/providers/LanguageProvider.jsx`): Initializes the language system on app startup
- **useTranslations Hook** (`src/hooks/useTranslations.js`): Provides translation functionality to components
- **Language Selector** (`src/components/common/LanguageSelector/LanguageSelector.jsx`): UI component for switching languages

### Features

- ✅ **Redux-based state management** - Language state is managed centrally
- ✅ **Persistent storage** - Language preference is saved in localStorage
- ✅ **Async message loading** - Messages are loaded dynamically for each locale
- ✅ **Fallback support** - Falls back to English if preferred locale fails to load
- ✅ **Real-time switching** - Language changes are applied immediately without page refresh
- ✅ **Type-safe translations** - Supports nested keys and interpolation

### Usage

#### 1. Basic Translation

```jsx
import { useTranslations } from "@/hooks/useTranslations";

function MyComponent() {
  const t = useTranslations("home.services");

  return (
    <div>
      <h1>{t("banner.title")}</h1>
      <p>{t("banner.description")}</p>
    </div>
  );
}
```

#### 2. Translation with Interpolation

```jsx
const t = useTranslations("home.services.serviceCard");

// In your translation file: "jobCompleted": "Job Completed: {count}"
<p>{t("jobCompleted", { count: 30 })}</p>

// In your translation file: "dailyRate": "Daily Rate: ${amount}"
<p>{t("dailyRate", { amount: 50 })}</p>
```

#### 3. Language Switching

```jsx
import { useDispatch, useSelector } from "react-redux";
import { setLocale, loadMessages } from "@/redux/features/languageSlice";

function LanguageSwitcher() {
  const dispatch = useDispatch();
  const { currentLocale } = useSelector((state) => state.language);

  const handleLanguageChange = async (newLocale) => {
    await dispatch(loadMessages(newLocale)).unwrap();
    dispatch(setLocale(newLocale));
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("fr")}>Français</button>
    </div>
  );
}
```

### Translation File Structure

Translation files are located in `src/messages/` and follow this structure:

```json
{
  "navigation": {
    "home": "Home",
    "aboutUs": "About Us"
  },
  "home": {
    "services": {
      "banner": {
        "title": "Choose the best talent",
        "description": "Choose the perfect freelancer..."
      }
    }
  }
}
```

### Available Locales

- **English (en)**: `src/messages/en.json`
- **French (fr)**: `src/messages/fr.json`

### State Structure

```javascript
{
  language: {
    currentLocale: "en",
    messages: {}, // Current locale messages
    allMessages: {}, // All loaded messages
    loading: false,
    error: null
  }
}
```

### Actions

- `loadMessages(locale)`: Async thunk to load messages for a specific locale
- `setLocale(locale)`: Set the current locale
- `setMessages({ locale, messages })`: Set messages for a specific locale
- `initializeLanguage({ locale, messages })`: Initialize the language system

### Best Practices

1. **Namespace Organization**: Group related translations under logical namespaces
2. **Key Naming**: Use descriptive, hierarchical keys (e.g., `home.services.banner.title`)
3. **Interpolation**: Use `{variable}` syntax for dynamic content
4. **Fallbacks**: Always provide fallback text for missing translations
5. **Performance**: Messages are cached after first load, so switching is instant

### Troubleshooting

- **Missing translations**: Check console for warnings about missing keys
- **Language not switching**: Ensure the language slice is properly connected to the store
- **Messages not loading**: Check that translation files exist and are properly formatted

### Migration from Context

If migrating from a context-based approach:

1. Replace `useLanguage()` with `useSelector((state) => state.language)`
2. Update `useTranslations` hook to use Redux state
3. Remove LanguageContext imports and usage
4. Ensure Redux store includes the language slice
