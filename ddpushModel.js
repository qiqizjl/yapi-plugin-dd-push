const baseModel = require('models/base.js');

class ddPushModel extends baseModel {
    getName() {
        return 'ddpush';
    }

    getSchema() {
        return {
            project_id: {
                type: Number,
                required: true
            },
            dingding_url: String,
            push_type: Object,
            add_time: Number,
            up_time: Number
        };
    }

    save(data) {
        let m = new this.model(data);
        return m.save();
    }

    get(project_id) {
        return this
            .model
            .findOne({project_id: project_id})
            .exec();
    }

    up(id, data) {
        return this
            .model
            .update({
                _id: id
            }, data, {runValidators: true});
    }
}

module.exports = ddPushModel;
