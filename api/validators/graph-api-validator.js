import { FILTER_TYPES } from '../../constants/constants.js';

export function getGraph(req, res, next) {
    const filter = req.query.filter;
    const isValidFilter = _checkIfFilterSupported(filter);
    
    if (filter && isValidFilter === false) {
        return next({ statusCode: 400, message: `Invalid filter parameter ${filter}` });
    }
    next();
}

function _checkIfFilterSupported(filterType) {
    const isValidFilter = Object.values(FILTER_TYPES).includes(filterType);
    return isValidFilter;
}

