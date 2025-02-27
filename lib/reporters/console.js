module.exports = function (errors) {
  if (errors.length > 0) {
    var messages = [];

    errors.forEach(function (error) {
      if (messages.length > 0) {
        messages.push('');
      }

      messages.push(error.message);
    });

    console.error(messages.join('\n'));
  }
};
