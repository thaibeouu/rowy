export enum routes {
  home = "/",

  auth = "/auth",
  impersonatorAuth = "/impersonatorAuth",
  jwtAuth = "/jwtAuth",
  signOut = "/signOut",
  signUp = "/signUp",

  authSetup = "/authSetup",
  setup = "/setup",
  deploy = "/deploy",
  pageNotFound = "/404",

  table = "/table",
  tableWithId = "/table/:id",
  tableGroup = "/tableGroup",
  tableGroupWithId = "/tableGroup/:id",

  settings = "/settings",
  userSettings = "/settings/user",
  projectSettings = "/settings/project",
  userManagement = "/settings/userManagement",
  rowyRunTest = "/rrTest",

  twitterCallback = "/twitterCallback",
}

export default routes;
