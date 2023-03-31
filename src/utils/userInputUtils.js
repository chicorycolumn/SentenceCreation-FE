exports.promptGuideword = () => {
  let info = prompt("Enter new guideword.");
  if (info) {
    return { guideword: info };
  }
};
