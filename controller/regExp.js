function regExpFunction(text) {
  // console.log();

  return text.toLowerCase().replace(/[/\s\'/]/g, "");
}

module.exports = { regExpFunction };
