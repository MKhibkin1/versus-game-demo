const AuthProvider = {
    isAuthenticated: false, 
    signin(callback){
        this.isAuthenticated = true
        setTimeout(callback, 100)
    },
    signout(callback){
        this.isAuthenticated = false;
        setTimeout(callback, 100);
    }
}


function RequireAuth(children) {
    // let auth = useAuth();
    // let location = useLocation();
    let auth

    if (!auth.user) {
      // Redirect them to the /login page, but save the current location they were
      // trying to go to when they were redirected. This allows us to send them
      // along to that page after they login, which is a nicer user experience
      // than dropping them off on the home page.
    //   return <Navigate to="/explore" state={{ from: location }} replace />;
    }
  
    return children;
  }



export { AuthProvider }