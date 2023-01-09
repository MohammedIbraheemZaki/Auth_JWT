import React, {useState, useEffect, useCallback} from 'react'

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  update: () => {}
});

// helper function return a result only
// calculate expiration time of token
const calculateRemainingTime = (expirationTime) => {
  // get time now
  const currentTime = new Date().getTime();
  // conver time from response into time with milli secound because it is string 
  const adjExpirationTime = new Date(expirationTime).getTime();
  // calculate time 2lly fadl 3la ma y5ls el el wa22t bta3 el token
  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
}

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);
  if(remainingTime <= 60000){
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime
  };
}

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken)

  const userIsLoggedIn = !!token;

  const logoutHandler = useCallback(() => {
    setToken(null);
    localStorage.removeItem('token')
    localStorage.removeItem('expirationTime')
    if(logoutTimer) {
      clearTimeout(logoutTimer)
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setToken(token);
    localStorage.setItem('token', token.idToken);
    localStorage.setItem('expirationTime', expirationTime)

    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);

  }

  const updateHandler = (token) => {
    setToken(token);
    localStorage.setItem('token', token.idToken);
  }

  useEffect(() => {
    if (tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler])

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    update: updateHandler
  }

  return (
    <AuthContext.Provider value={contextValue} >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext