export const loggingMiddleware = (req, res, next) => {
  const currentTimestamp = new Date().toUTCString();
  const reqMethod = req.method;
  const reqRoute = req.originalUrl;
  const userAuthStatus = (req.session.user) ? 'Authenticated User' : 'Non-Authenticated User';
  console.log(`${currentTimestamp}: ${reqMethod} ${reqRoute} ${userAuthStatus}`);
  next();  
}

export const rootMiddleware = (req, res, next) => {
  if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin/adminhome');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/user/protectedUserHomePage');
      }
  }
  if(req.url === '/') return res.redirect('/user/landingpage');
  next();
};

export const landingPageMiddleware = (req, res, next) => {
  if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin/adminhome');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/user/protectedUserHomePage');
      }
  }
  next();
  };

export const signInMiddleware = (req, res, next) => {
  if (req.session.user) {
      if (req.session.user.role === 'admin') {
        return res.redirect('/admin/adminhome');
      } else if (req.session.user.role === 'user') {
        return res.redirect('/user/protectedUserHomePage');
      }
  }
  if(req.url === '/') return res.redirect('/user');
  next();
}

export const signUpMiddleware = (req, res, next) => {
if (req.session.user) {
    if (req.session.user.role === 'admin') {
      return res.redirect('/admin/adminhome');
    } else if (req.session.user.role === 'user') {
      return res.redirect('/user/protectedUserHomePage');
    };
};
if(req.url === '/') return res.redirect('/user');
next();
};


export const userHomePageMiddleware = (req, res, next) => {
if (!req.session.user) {
  return res.redirect('/user/signIn');
};
if(req.session.user.role === 'admin') {
  return res.redirect('/admin/adminhome');
};
next();
};

export const userRestrictMiddleware  = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/user/signIn');
  };
  if(req.session.user.role === 'user') {
    return res.redirect('/user/error')
  };
  next();
};

export const userProfilePageMiddleware = (req, res, next) => {
if (!req.session.user) {
  return res.redirect('/user/signIn');
};
next();
}

export const updatePlanMiddleware = (req, res, next) => {
if (!req.session.user) {
  return res.redirect('/user/signIn');
};
next();
};

export const ensureAuthenticated = (req, res, next) => {
if (req.session.user) {
  req.user = req.session.user;
  return next();
}
res.redirect('/user/signIn');
};

export const updateMiddleware = (req, res, next) => {
if (!req.session.user) {
  return res.redirect('/user/signIn');
};
next();
};
export const reviewMiddleware  = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/user/signIn');
  };
  if(req.session.user.role === 'admin') {
    return res.redirect('/user/error')
  };
  req.user = req.session.user;
  next();
};





