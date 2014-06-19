define(function () {
    return function (req, res, model, endpoint, isObjectRequest) {
        var action,
            params = req.params,
            access = false,
            method = req.method.toLowerCase(),
            actionList,
            i = 0;

        if (!endpoint[params.version] || !endpoint[params.version][method]) {
            return res.send(404);
        }
        actionList = endpoint[params.version][method];

        // request has an objectid.
        if (isObjectRequest) {
            if (!params.objectId) {
                return res.send(404, 'objectid_not_found');
            }
            // try to find object of class model.
            model.findById(params.objectId, function (err, object) {
                if (err) {
                    return res.send(404, 'object_not_found');
                }
                // put object on req.object.
                req.object = object;
                // if there is special action.
                if (params.action) {
                    // check if action exists.
                    if (!actionList[params.action]) {
                        return res.send(404, 'action_not_found');
                    }
                    action = actionList[params.action];
                } else {
                    // load default object action 'object'.
                    if (!actionList.object) {
                        return res.send(404, 'action_not_found');
                    }
                    action = actionList.object;
                }
            });
        } else {
            // if action is set
            if (params.action) {
                // check if actions exists.
                if (!actionList[params.action]) {
                    return res.send(404, 'action_not_found');
                }
                action = actionList[params.action];
            } else {
                // check if default class action '' exists.
                if (!actionList['']) {
                    return res.send(404, 'action_not_found');
                }
                action = actionList[''];
            }
        }
        // check if action has permissions.
        if (action.permissions && action.permissions.length > 0) {
            // check if token auth puts user object on req.user has permissions
            if (req.user && req.user.permissions) {
                // check if user has required permission by action
                for (i; i < req.user.permissions.length; i = i + 1) {
                    if (action.permissions.indexOf(req.user.permissions[i]) > -1) {
                        access = true;
                        break;
                    }
                }
            }
        } else {
            access = true;
        }
        // if user is allowed to do action
        if (!access) {
            return res.send(403, 'permission_denied');
        }
        action.exec(req, res);
    };
});