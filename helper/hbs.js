const moment = require('moment')

module.exports = {
    /**
     * @param {*} date 
     * @param {*} format 
     * @returns 
     */
    formatDate: (date, format) => moment(date).format(format)
}