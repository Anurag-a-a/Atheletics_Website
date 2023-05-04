export const loggingMiddleware = (req, res, next) => {
    // console.log('loggingMiddleware')
    const currentTimestamp = new Date().toUTCString();
    const reqMethod = req.method;
    const reqRoute = req.originalUrl;
    const userAuthStatus = (req.session.user) ? 'Authenticated User' : 'Non-Authenticated User';
    console.log(`${currentTimestamp}: ${reqMethod} ${reqRoute} ${userAuthStatus}`);
    next();  
}
export const signInMiddleware = (req, res, next) => {
    // console.log('loginMiddleware');
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
          return res.redirect('/admin');
        } else if (req.session.user.role === 'user') {
          return res.redirect('/protectedUserHomePage');
        }
    }
    if(req.url === '/') return res.redirect('/');
    next();
}

export const signUpMiddleware = (req, res, next) => {
  // console.log('loginMiddleware');
  if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/protectedUserHomePage');
      }
  }
  if(req.url === '/') return res.redirect('/');
  next();
}

export const userHomePageMiddleware = (req, res, next) => {
  // console.log('loginMiddleware');
  if (!req.session.user) {
    return res.redirect('/signIn');
  };
  next();
}

export const userProfilePageMiddleware = (req, res, next) => {
  // console.log('loginMiddleware');
  if (!req.session.user) {
    return res.redirect('/signIn');
  };
  next();
}