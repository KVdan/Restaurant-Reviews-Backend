import jwt from "jsonwebtoken";

// take 'like some post' for example
// click the like button => auth middleware (NEXT) => like controller...

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const isCustomAuth = token.length < 500;
    let decodeData;
    if (token && isCustomAuth) {
      decodeData = jwt.verify(token, "test");
      req.userId = decodeData?.id;
      console.log(decodeData);
    } else {
      decodeData = jwt.decode(token);
      req.userId = decodeData?.sub;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
