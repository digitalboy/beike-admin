const serverIp = "https://server.beike.ai";

export default {
  loginUrl: `${serverIp}/api/user/login`,

  subjectListUrl: `${serverIp}/api/subject/list`,
  lessonListUrl: `${serverIp}/api/lesson/list`,
  lessonUpdateUrl: `${serverIp}/api/lesson/update`,
  lessonAddUrl: `${serverIp}/api/lesson/new`,

  gradeListUrl: `${serverIp}/api/grade/list`,
  gradeUpdateUrl: `${serverIp}/api/grade/update`,

  unitListUrl: `${serverIp}/api/unit/list`,
  unitUpdateUrl: `${serverIp}/api/unit/update`,

  disIntListUrl: `${serverIp}/api/dis_int/list`,
  disIntUpdateUrl: `${serverIp}/api/dis_int/update`,
  disIntAddUrl: `${serverIp}/api/dis_int/new`,
  disIntDelUrl: `${serverIp}/api/dis_int/delete`,

  theoryListByTagUrl: `${serverIp}/api/theory/list`,
  theoryUpdateUrl: `${serverIp}/api/theory/update`,
  theoryAddUrl: `${serverIp}/api/theory/new`,
  theoryDelUrl: `${serverIp}/api/theory/delete`,
  allTagsListUrl: `${serverIp}/api/theory/tags`,

  eduDesListURl: `${serverIp}/api/edudes/list`,
  eduDesAddUrl: `${serverIp}/api/edudes/new`,
  eduDesUpdateUrl: `${serverIp}/api/edudes/update`,

  creatBotUrl: `${serverIp}/api/chatbot/create_chatbot`,

  // openAI API
  openAIUrl: "https://api.openai.com/v1/chat/completions",
  openAIKey: "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",

  // similarity search API
  similaSearchUrl: `${serverIp}/api/chatbot/similarity-search`,

}