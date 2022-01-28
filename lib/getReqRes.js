function getReqRes(reqOrContext, res = null) {
  const isSSP = Boolean(reqOrContext?.req && !res);
  const isAppCtx = Boolean(reqOrContext?.ctx?.req && !res);

  let _req = reqOrContext;
  let _res = res;

  if (isSSP && !isAppCtx) {
    _req = reqOrContext.req;
    _res = reqOrContext.res;
  } else if (isAppCtx) {
    _req = reqOrContext.ctx.req;
    _res = reqOrContext.ctx.res;
  }

  return { req: _req, res: _res, isContext: isSSP || isAppCtx };
}

export default getReqRes;
