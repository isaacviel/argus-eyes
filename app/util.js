var child_process = require('child_process');
var fs            = require('fs');
var util          = require('util');
var glob          = require('glob');
var mkdirp        = require('mkdirp');

/**
 * Expose module functions
 */
module.exports = {
    escape,
    fileExists,
    directoryExists,
    isExecutable,
    mkdir,
    removeEmptyDirectories,
    format: util.format,
    plural
};

/**
 * Escape double quotes
 *
 * @param {String} str
 * @returns {String}
 */
function escape(str) {
    return str.replace(/"/g, '\\"');
}

/**
 * Checks if a path exists and is of the type 'file'
 *
 * @param {String} file
 * @returns {Boolean}
 */
function fileExists(file) {
    try {
        return fs.statSync(file).isFile();
    } catch (e) {
        return false;
    }
}

/**
 * Checks if a path exists and is of the type 'directory'
 *
 * @param {String} dir
 * @returns {Boolean}
 */
function directoryExists(dir) {
    try {
        return fs.statSync(dir).isDirectory();
    } catch (e) {
        return false;
    }
}

/**
 * Checks if a command is executable, and returns an exit code 0
 *
 * @param {String} cmd
 * @param {String[]} args
 * @returns {Boolean}
 */
function isExecutable(cmd, args) {
    try {
        child_process.execFileSync(cmd, args);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Brute-force try to make a directory, ignoring a failure
 *
 * @param {String} dir
 */
function mkdir(dir) {
    try {
        mkdirp.sync(dir);
    } catch (e) {}
}

/**
 * Remove all empty directories within a path
 * @param {String} dir
 */
function removeEmptyDirectories(dir) {
    glob.sync(dir + '/**').forEach(node => {
        var isDir = directoryExists(node);
        var isEmpty = glob.sync(node + '/**/*').length === 0;
        if (isDir && isEmpty) {
            fs.rmdir(node);
        }
    });
}

/**
 * Returns an empty string or a 's' character depending on whether it needs pluralization
 *
 * @param {Number} num
 * @returns {String}
 */
function plural(num) {
    return num === 1 ? '' : 's';
}
