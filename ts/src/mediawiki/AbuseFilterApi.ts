export class AbuseFilterApi {

    public static async fetchAbuseFilterText(filterId: number): Promise<string> {
        const api = new mw.Api();
        const response = await api.get({
            action: 'query',
            list: 'abusefilters',
            abfprop: 'id|pattern',
            abfstartid: filterId,
            abflimit: 1
        });

        const filterObject = response.query.abusefilters[0] as { id: number, pattern?: string };
        if (filterObject.id === filterId) {
            if (filterObject.pattern) return filterObject.pattern;
            throw new Error('You don\'t have permission to view this filter');
        }

        throw new Error('Filter not found');
    }
}