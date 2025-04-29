export class AbuseFilterApi {

    public static async fetchAbuseFilterText(filterId: number | string): Promise<string> {
        let api = new mw.Api();
        if (filterId.toString().startsWith('global-')) {
            filterId = filterId.toString().replace('global-', '');
            api = new mw.ForeignApi('https://meta.wikimedia.org/w/api.php');
        }
        
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
            aflprop: 'ids|details',
            maxage: 3600, // log entries don't change, so we can cache them for a long time
            smaxage: 43200,
        });

        const logObject = response?.query?.abuselog?.[0] as AbuseLogEntry | undefined;

        if (logObject !== undefined){
            return logObject;
        }

        throw new Error('Log entry does not exist or you have no permissions to view it');
    }

    public static async* fetchAbuseLogEntries(filterId: number | string, limit: number): AsyncGenerator<AbuseLogEntry> {
        const api = new mw.Api();
        
        let remaining = limit;
        let aflStart = 'now';
        while (remaining > 0) {
            const apiLimit = Math.min(remaining, 5000); // API limit is 5000
            const response = await api.get({
                action: 'query',
                list: 'abuselog',
                aflfilter: filterId,
                afllimit: apiLimit,
                aflstart: aflStart,
                aflprop: 'ids|details',
                maxage: 600, // new log entries will appear in the list as the time passess, so cache time shouldn't be too long
                smaxage: 1800,
            });

            const logObjects = response?.query?.abuselog as AbuseLogEntry[] | undefined;
            if (logObjects === undefined) {
                throw new Error(`Unable to fetch log entries for filter ${filterId}. You might not have permission to view them.`);
            }

            for (const logObject of logObjects) {
                yield logObject;
            }

            remaining -= logObjects.length ?? 0;
            aflStart = response.continue.aflstart;
        }
    }
}

export interface AbuseLogEntry {
    id: number;
    filter_id: number;
    details: Record<string, unknown>;
}