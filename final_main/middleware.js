export const loggingMiddleware = (req, res, next) => {
    const currentTimestamp = new Date().toUTCString();
    const reqMethod = req.method;
    const reqRoute = req.originalUrl;
    const userAuthStatus = (req.session.user) ? 'Authenticated User' : 'Non-Authenticated User';
    console.log(`${currentTimestamp}: ${reqMethod} ${reqRoute} ${userAuthStatus}`);
    next();  
}

export const landingPageMiddleware = (req, res, next) => {
  if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/protectedUserHomePage');
      }
  }
  next();
}

export const signInMiddleware = (req, res, next) => {
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
  if (!req.session.user) {
    return res.redirect('/signIn');
  };
  next();
}

export const userProfilePageMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signIn');
  };
  next();
}

export const updatePlanMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signIn');
  };
  next();
}