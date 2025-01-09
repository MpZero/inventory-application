function regExpFunction(text) {
  return text.toLowerCase().replace(/[/\s\'/]/g, "");
}

module.exports = { regExpFunction };
