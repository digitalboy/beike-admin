const serverIp = "http://server.beike.ai";

export default {
  loginUrl: `${serverIp}:8009/api/user/login`,

  subjectListUrl: `${serverIp}:8009/api/subject/list`,
  lessonListUrl: `${serverIp}:8009/api/lesson/list`,
  lessonUpdateUrl: `${serverIp}:8009/api/lesson/update`,
  lessonAddUrl: `${serverIp}:8009/api/lesson/new`,

  gradeListUrl: `${serverIp}:8009/api/grade/list`,
  gradeUpdateUrl: `${serverIp}:8009/api/grade/update`,

  unitListUrl: `${serverIp}:8009/api/unit/list`,
  unitUpdateUrl: `${serverIp}:8009/api/unit/update`,

  disIntListUrl: `${serverIp}:8009/api/dis_int/list`,
  disIntUpdateUrl: `${serverIp}:8009/api/dis_int/update`,
  disIntAddUrl: `${serverIp}:8009/api/dis_int/new`,
  disIntDelUrl: `${serverIp}:8009/api/dis_int/delete`,

  theoryListUrl: `${serverIp}:8009/api/theory/list`,
  theoryUpdateUrl: `${serverIp}:8009/api/theory/update`,
  theoryAddUrl: `${serverIp}:8009/api/theory/new`,
  theoryDelUrl: `${serverIp}:8009/api/theory/delete`,
  tagListUrl: `${serverIp}:8009/api/theory/list`,

  eduDesListURl: `${serverIp}:8009/api/edudes/list`,
  eduDesAddUrl: `${serverIp}:8009/api/edudes/new`,
  eduDesUpdateUrl: `${serverIp}:8009/api/edudes/update`,
}

