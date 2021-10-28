const { getFileExtension } = require('./fileExtensionValidator');

/**
 * Separates the provided files list to 'accepted' and 'no_accepted' lists.
 * 
 * @param files
 * @param acceptedFileTypes
 * @returns {Promise<FileFilterResult>}
 */
async function filterFiles(files, acceptedFileTypes) {
  
  try {
    if (files.length < 1) return Promise.reject('No files are provided. Exiting.');
    if (acceptedFileTypes.length < 1) {
      return Promise.reject('Accepted file type list is not provided. Exiting.');
    }
    
    let result = new FileFilterResult();
    
    files.forEach(singleFile => {
      const fileType = getFileExtension(singleFile);
      if (acceptedFileTypes.contains(fileType)) {
        result['accepted'].push(singleFile);
      } else {
        result['not_accepted'].push(singleFile);
      }
    });
    
    return Promise.resolve(result);
  } catch (e) {
    return Promise.reject(e);
  }
}

class FileFilterResult{
  accepted = [];
  not_accepted = [];
}

module.exports.filterFiles = filterFiles;
module.exports.FileFilterResult = FileFilterResult;