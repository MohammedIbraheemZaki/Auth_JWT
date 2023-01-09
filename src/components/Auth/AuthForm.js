import { useState, useRef, useContext } from 'react';
import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';
// start from video 10

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(null)
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext)

  const newSubmitHandler = (e, isLogin) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    setLoading(true);
    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${isLogin? 'signInWithPassword':'signUp'}?key=AIzaSyAjWSRz5zsbkEjf6vk-mHqJ259DBKO3BWE`,{
      method: 'POST',
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true 
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then((res) => {
      setLoading(false)
      setFormError('')
      if(res.ok){
        return res.json().then(data => {
          const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)))
          authCtx.login(data, expirationTime.toISOString())
          history.replace('/');
          
        })
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authentication failed'; 
          // if(data && data.error && data.error.message){
          //   setFormError(errorMessage)
          // }
          throw new Error(errorMessage)
        })
      }
    })
    .catch(err => {
      alert(err.message)
    })
  }


  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   const enteredEmail = emailInputRef.current.value;
  //   const enteredPassword = passwordInputRef.current.value;
  //   setLoading(true);
  //   if(isLogin) {
  //     fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAjWSRz5zsbkEjf6vk-mHqJ259DBKO3BWE`,{
  //       method: 'POST',
  //       body: JSON.stringify({
  //         email: enteredEmail,
  //         password: enteredPassword,
  //         returnSecureToken: true 
  //       }),
  //       headers: {
  //         'content-type': 'application/json'
  //       }
  //     }).then((res) => {
  //       if(res.ok){
  //         return res.json().then(data => {
  //           console.log(data)
  //         })
  //       } else {
  //         return res.json().then(data => {
  //           let errorMessage = 'Authentication failed';
  //           if(data && data.error && data.error.message){
  //             setFormError(errorMessage)
  //           }
  //           alert(data.error.message)
  //         })
  //       }
  //     })
  //   } else {
  //     fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAjWSRz5zsbkEjf6vk-mHqJ259DBKO3BWE`,{
  //       method: 'POST',
  //       body: JSON.stringify({
  //         email: enteredEmail,
  //         password: enteredPassword,
  //         returnSecureToken: true 
  //       }),
  //       headers: {
  //         'content-type': 'application/json'
  //       }
  //     }).then((res) => {
  //       setLoading(false)
  //       setFormError('')
  //       if(res.ok){
  //         // do some thing here
  //         return res.json().then(data => {
  //           console.log(data);
  //         })
          
  //       } else {
  //         return res.json().then(data => {
  //           // show error message
  //           let errorMessage = 'Authentication failed';
  //           if(data && data.error && data.error.message){
  //             setFormError(errorMessage)
  //           }
  //           alert(data.error.message)
  //         }); 
  //       }
  //     })
  //   }
  // }


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={(e) => newSubmitHandler(e,isLogin)} >
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div style={{color: '#fff'}} >{formError}</div>
        <div className={classes.actions}>
          <button >{isLogin ? 'Login' : loading ? 'loading...':'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
