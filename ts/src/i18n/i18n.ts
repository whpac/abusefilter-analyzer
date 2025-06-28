// Load here all the supported languages
import en from './en.json' with { type: 'json' };
import pl from './pl.json' with { type: 'json' };

export function i18n(key: string, ...args: unknown[]): string {
    return mw.message(key, ...args).text();
}

export function initializeTranslations(): void {
    // Always load the English messages, optionally override them later on load
    mw.messages.set(en);

    // Store the supported languages here, but skip English which is loaded
    // by default, regardless of the user's language settings.
    const supportedLanguages = {
        pl
    };

    const userLanguage = mw.config.get('wgUserLanguage');
    if (userLanguage in supportedLanguages) {
        // Load the user's language messages if available
        mw.messages.set(supportedLanguages[userLanguage as keyof typeof supportedLanguages]);
    }
}