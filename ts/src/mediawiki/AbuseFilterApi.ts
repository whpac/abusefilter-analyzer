export class AbuseFilterApi {

    public static async fetchAbuseFilterText(filterId: number | string): Promise<string> {
        const api = new mw.Api();
        const response = await api.get({
            action: 'query',
            list: 'abusefilters',
            abfprop: 'id|pattern',
            abfstartid: filterId,
            abflimit: 1
        });

        const filterObject = response.query.abusefilters[0] as { id: string, pattern?: string };
        if (filterObject.id == filterId) {
            if (filterObject.pattern) return filterObject.pattern;
            throw new Error('You don\'t have permission to view this filter');
        }

        throw new Error(`Filter ${filterId} not found`);
    }

    public static async fetchAbuseLogEntry(logId: number | string): Promise<AbuseLogEntry> {
        const api = new mw.Api();
        const response = await api.get({
            action: 'query',
            list: 'abuselog',
            afllogid: logId,
            aflprop: 'ids|details'
        });

        const logObject = response?.query?.abuselog?.[0] as AbuseLogEntry | undefined;

        if (logObject !== undefined){
            return logObject;
        }

        throw new Error('Log entry does not exist or you have no permissions to view it');
    }
}

export interface AbuseLogEntry {
    id: number;
    filter_id: number;
    details: Record<string, unknown>;
}