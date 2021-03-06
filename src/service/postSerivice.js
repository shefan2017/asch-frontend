angular.module('asch').service('postSerivice', function ($http, $translate) {
    let that = this;
    this.post = function (data) {
        var req = {
            method: 'post',
            url: '{{postApi}}',
            headers: { 'magic': '{{magic}}', 'version': '' },
            data: {
                transaction: data
            }
        }
        return $http(req);
    }
    this.retryPostImp = function(funcCreate, timeAdjust, countNum, cb) {
        let trs = funcCreate()
        that.post(trs).success(function(res){
            if (/timestamp/.test(res.error)) {
                if (countNum > 3) {
                    var err = 'adjust';
                    return cb(err, res);
                } else {
                    toastError($translate.instant('ADJUST_TIME'));
                    that.retryPostImp(funcCreate, timeAdjust + 5, countNum + 1,cb);
                }
            } else if(/processed/.test(res.error)) {
                that.retryPostImp(funcCreate, timeAdjust, countNum, cb);
            } else {
                cb(null, res);
            }
        }).error(function(res){
            var err = 1;
            cb(err, res);
        })
    }
    this.retryPost = function (funcCreate, cb) {
        this.retryPostImp(funcCreate, 5, 0,cb)
    }
    this.writeoff = function (data) {
        var req = {
            method: 'post',
            url: '{{postApi}}',
            headers: { 'magic': '{{magic}}', 'version': '' },
            data: {
                transaction: data
            }
        }
        return $http(req);
    }
});