function getBody(req, fields) {
  const data = req.body || {};
  if (typeof data !== 'object') throw { message: 'body-type' };

  if (fields && Array.isArray(fields)) {
    const failedFields = [];
    fields.forEach((field) => {
      if (!data.hasOwnProperty(field) || !data[field]) {
        failedFields.push(field);
      } else if (data[field] && data[field].length === 0) {
        failedFields.push(field);
      }
    });
    if (failedFields.length > 0) {
      throw {
        message: 'fields-required',
        opts: {
          fields: failedFields,
        },
      };
    }
  }

  return data;
}

export default getBody;
