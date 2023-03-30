exports.promptDemowordGuideword = () => {
  let info = prompt(
    'Enter new demo word, and guide word after a comma if different. eg "woman", or "kobieta,woman".'
  );
  if (!info) {
    return;
  }
  info = info.split(",").map((str) => str.trim());
  let demoword = info[0];
  let guideword = info[1] || info[0];
  if (demoword[0] === "*" && guideword[0] !== "*") {
    guideword = "*" + guideword;
  }
  return { demoword, guideword };
};
