import getReqRes from "@/lib/getReqRes";

function isAuth(reqOrContext) {
  const { req } = getReqRes(reqOrContext);
  return Boolean(req?.session?.user);
}

export default isAuth;
