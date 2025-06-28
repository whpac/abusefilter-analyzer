// Load here all the supported languages
import en from './en.json' with { type: 'json' };

export function i18n(key: string, ...args: unknown[]): string {
    return mw.message(key, ...args).text();
}

export function initializeTranslations(): void {
    // Always load the English messages, optionally override them later on load
    mw.messages.set(en);
}