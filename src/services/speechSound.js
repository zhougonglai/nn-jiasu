import Request from '@utils/request';

export default class SpeechSoundService {
    constructor() {
        this.request = new Request(
            process.env.VUE_APP_NN_API + process.env.VUE_APP_NN_NAMESPACE,
        );
    }

    async getCategoryList() {
        return await this.request.post('/category/list');
    }
    async getChannelList(category, sort) {
        return await this.request.post('/channel/list', {
            "last_id": 0,
            "limit": 21,
            "category_id": category,
            "tag_id": 0,
            "sort_type": sort
        })
    }
}